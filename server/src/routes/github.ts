import { FastifyPluginAsync } from "fastify"
import rateLimit from "@fastify/rate-limit"
import { isDevMode } from "./static.js"

const CACHE_TTL_MS = 30 * 60 * 1000

export interface ContributionDay {
  date: string
  count: number
  level: number
  weekday: number
}

export interface ContributionsResponse {
  totalContributions: number
  weeks: ContributionDay [ ] [ ]
  users: string [ ]
  source: "graphql" | "events"
  cached: boolean
}

interface GraphQLDay {
  contributionCount: number
  date: string
  weekday: number
}

interface GraphQLCalendar {
  totalContributions: number
  weeks: { contributionDays: GraphQLDay [ ] } [ ]
}

let contributionsCache: { expiresAt: number; payload: Omit<ContributionsResponse, "cached"> } | null = null

const USER_CONTRIBUTIONS_QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            weekday
          }
        }
      }
    }
  }
}`

const VIEWER_CONTRIBUTIONS_QUERY = `
query {
  viewer {
    login
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            weekday
          }
        }
      }
    }
  }
}`

const githubHeaders = ( ): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "matthewfrankland-website"
  }
  const token = process.env [ "GITHUB_TOKEN" ]?.trim ( )
  if ( token ) {
    headers [ "Authorization" ] = `Bearer ${token}`
  }
  return headers
}

const githubUsers = ( ): string [ ] => {
  const env = process.env [ "GITHUB_USERS" ] ?? "m-f-1998,mattfrank48"
  return env.split ( "," ).map ( s => s.trim ( ) ).filter ( Boolean )
}

const fetchJson = async <T>( url: string ): Promise<T | null> => {
  try {
    const response = await fetch ( url, { headers: githubHeaders ( ) } )
    if ( !response.ok ) {
      console.warn ( `GitHub API ${response.status} for ${url}` )
      return null
    }
    return await response.json ( ) as T
  } catch ( err ) {
    console.error ( "GitHub API error:", err )
    return null
  }
}

const levelForCount = ( count: number, max: number ): number => {
  if ( count <= 0 ) return 0
  if ( max <= 0 ) return 1
  const ratio = count / max
  if ( ratio <= 0.25 ) return 1
  if ( ratio <= 0.5 ) return 2
  if ( ratio <= 0.75 ) return 3
  return 4
}

const applyLevels = ( weeks: ContributionDay [ ] [ ] ): ContributionDay [ ] [ ] => {
  let max = 0
  for ( const week of weeks ) {
    for ( const day of week ) {
      if ( day.count > max ) max = day.count
    }
  }

  return weeks.map ( week =>
    week.map ( day => ( {
      ...day,
      level: levelForCount ( day.count, max )
    } ) )
  )
}

const fetchTokenLogin = async ( ): Promise<string | null> => {
  if ( !process.env [ "GITHUB_TOKEN" ]?.trim ( ) ) {
    return null
  }

  const profile = await fetchJson<{ login?: string }> ( "https://api.github.com/user" )
  return profile?.login?.toLowerCase ( ) ?? null
}

const parseContributionsResponse = (
  login: string,
  collection?: {
    restrictedContributionsCount?: number
    contributionCalendar?: GraphQLCalendar
  } | null
): GraphQLCalendar | null => {
  const calendar = collection?.contributionCalendar
  if ( !calendar ) {
    return null
  }

  const restricted = collection?.restrictedContributionsCount ?? 0
  console.info (
    `GitHub contributions for ${login}: ${calendar.totalContributions} total` +
    ( restricted > 0 ? ` (${restricted} restricted/private hidden from viewer)` : "" )
  )

  return calendar
}

const fetchContributionsGraphQL = async (
  login: string,
  tokenOwnerLogin: string | null
): Promise<GraphQLCalendar | null> => {
  const useViewer = tokenOwnerLogin !== null && login.toLowerCase ( ) === tokenOwnerLogin

  try {
    const response = await fetch ( "https://api.github.com/graphql", {
      method: "POST",
      headers: githubHeaders ( ),
      body: JSON.stringify (
        useViewer
          ? { query: VIEWER_CONTRIBUTIONS_QUERY }
          : { query: USER_CONTRIBUTIONS_QUERY, variables: { login } }
      )
    } )

    if ( !response.ok ) {
      console.warn ( `GitHub GraphQL ${response.status} for ${login}` )
      return null
    }

    const body = await response.json ( ) as {
      data?: {
        user?: {
          contributionsCollection?: {
            restrictedContributionsCount?: number
            contributionCalendar?: GraphQLCalendar
          }
        }
        viewer?: {
          login?: string
          contributionsCollection?: {
            restrictedContributionsCount?: number
            contributionCalendar?: GraphQLCalendar
          }
        }
      }
      errors?: unknown [ ]
    }

    if ( body.errors?.length ) {
      console.warn ( `GitHub GraphQL errors for ${login}:`, body.errors )
      return null
    }

    if ( useViewer ) {
      const viewerLogin = body.data?.viewer?.login ?? login
      return parseContributionsResponse (
        viewerLogin,
        body.data?.viewer?.contributionsCollection
      )
    }

    return parseContributionsResponse (
      login,
      body.data?.user?.contributionsCollection
    )
  } catch ( err ) {
    console.error ( "GitHub GraphQL error:", err )
    return null
  }
}

const mergeCalendars = ( calendars: GraphQLCalendar [ ] ): ContributionDay [ ] [ ] => {
  const counts = new Map<string, number> ( )

  for ( const calendar of calendars ) {
    for ( const week of calendar.weeks ) {
      for ( const day of week.contributionDays ) {
        counts.set ( day.date, ( counts.get ( day.date ) ?? 0 ) + day.contributionCount )
      }
    }
  }

  const template = calendars [ 0 ]!
  const weeks = template.weeks.map ( week =>
    week.contributionDays.map ( day => ( {
      date: day.date,
      count: counts.get ( day.date ) ?? 0,
      level: 0,
      weekday: day.weekday
    } ) )
  )

  return applyLevels ( weeks )
}

interface GitHubEvent {
  created_at: string
}

const fetchContributionsFromEvents = async ( login: string ): Promise<Map<string, number>> => {
  const counts = new Map<string, number> ( )

  for ( let page = 1; page <= 4; page++ ) {
    const events = await fetchJson<GitHubEvent [ ]> (
      `https://api.github.com/users/${login}/events/public?per_page=100&page=${page}`
    )
    if ( !events?.length ) break

    for ( const event of events ) {
      const date = event.created_at.slice ( 0, 10 )
      counts.set ( date, ( counts.get ( date ) ?? 0 ) + 1 )
    }

    if ( events.length < 100 ) break
  }

  return counts
}

const buildWeeksFromCounts = ( counts: Map<string, number> ): ContributionDay [ ] [ ] => {
  const today = new Date ( )
  today.setHours ( 0, 0, 0, 0 )

  const start = new Date ( today )
  start.setDate ( start.getDate ( ) - 364 )
  while ( start.getDay ( ) !== 0 ) {
    start.setDate ( start.getDate ( ) - 1 )
  }

  const weeks: ContributionDay [ ] [ ] = [ ]
  let currentWeek: ContributionDay [ ] = [ ]
  const cursor = new Date ( start )

  while ( cursor <= today ) {
    const date = cursor.toISOString ( ).slice ( 0, 10 )
    currentWeek.push ( {
      date,
      count: counts.get ( date ) ?? 0,
      level: 0,
      weekday: cursor.getDay ( )
    } )

    if ( currentWeek.length === 7 ) {
      weeks.push ( currentWeek )
      currentWeek = [ ]
    }

    cursor.setDate ( cursor.getDate ( ) + 1 )
  }

  if ( currentWeek.length ) {
    weeks.push ( currentWeek )
  }

  return weeks
}

const loadContributions = async ( ): Promise<Omit<ContributionsResponse, "cached">> => {
  const users = githubUsers ( )
  const graphCalendars: GraphQLCalendar [ ] = [ ]
  const tokenOwnerLogin = await fetchTokenLogin ( )

  if ( tokenOwnerLogin ) {
    console.info ( `GitHub token authenticated as ${tokenOwnerLogin}` )
  }

  for ( const login of users ) {
    const calendar = await fetchContributionsGraphQL ( login, tokenOwnerLogin )
    if ( calendar ) {
      graphCalendars.push ( calendar )
    } else if ( tokenOwnerLogin !== login.toLowerCase ( ) ) {
      console.warn (
        `GitHub contributions for ${login} are public-only (token belongs to ${tokenOwnerLogin ?? "no account"})`
      )
    }
  }

  if ( graphCalendars.length ) {
    const weeks = mergeCalendars ( graphCalendars )
    const totalContributions = weeks
      .flat ( )
      .reduce ( ( sum, day ) => sum + day.count, 0 )

    return {
      totalContributions,
      weeks,
      users,
      source: "graphql"
    }
  }

  const combined = new Map<string, number> ( )
  for ( const login of users ) {
    const counts = await fetchContributionsFromEvents ( login )
    counts.forEach ( ( count, date ) => {
      combined.set ( date, ( combined.get ( date ) ?? 0 ) + count )
    } )
  }

  const weeks = applyLevels ( buildWeeksFromCounts ( combined ) )
  const totalContributions = weeks
    .flat ( )
    .reduce ( ( sum, day ) => sum + day.count, 0 )

  return {
    totalContributions,
    weeks,
    users,
    source: "events"
  }
}

export const router: FastifyPluginAsync = async app => {
  await app.register ( rateLimit, {
    max: isDevMode ( ) ? 120 : 30,
    timeWindow: "10 minute"
  } )

  app.get ( "/contributions", async ( _req, rep ) => {
    const now = Date.now ( )
    if ( contributionsCache && contributionsCache.expiresAt > now ) {
      return rep
        .header ( "Cache-Control", "public, max-age=600, stale-while-revalidate=1800" )
        .send ( { ...contributionsCache.payload, cached: true } )
    }

    try {
      const payload = await loadContributions ( )
      contributionsCache = {
        payload,
        expiresAt: now + CACHE_TTL_MS
      }

      return rep
        .header ( "Cache-Control", "public, max-age=600, stale-while-revalidate=1800" )
        .send ( { ...payload, cached: false } )
    } catch ( err ) {
      console.error ( "Contributions load failed:", err )
      return rep.status ( 502 ).send ( { message: "Unable to load GitHub contributions." } )
    }
  } )
}
