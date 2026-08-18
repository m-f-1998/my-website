import { extname, join, resolve } from "path"
import { createReadStream } from "fs"
import { access, constants, readFile, stat } from "fs/promises"
import { FastifyPluginAsync } from "fastify"
import mime from "mime"
import { config } from "dotenv"

config ( { path: resolve ( process.cwd ( ), ".env" ), quiet: true } )

/** Opt-in only — unset / any other value means production-safe behaviour. */
export const isDevMode = ( ): boolean => {
  return process.env [ "DEV_MODE" ] === "true" || process.env [ "DEV_MODE" ] === "1"
}

const browserDist = join ( process.cwd ( ), "../client/dist/browser" )
const dockerClient = join ( process.cwd ( ), "../client" )

const resolveClientFolder = async ( ): Promise<string> => {
  try {
    await access ( join ( browserDist, "index.html" ), constants.F_OK )
    return browserDist
  } catch {
    return dockerClient
  }
}

const clientFolderPromise = resolveClientFolder ( )

const HASHED_ASSET_RE = /[-][A-Z0-9]{8}\.(js|css)$/i

let indexHtmlBase: string | null = null

// Plugin registration is sync; route handlers are async
// eslint-disable-next-line @typescript-eslint/require-await
export const router: FastifyPluginAsync = async app => {
  app.get ( "*", async ( req, rep ) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const asset = req.params as { "*": string }
    const rawPath = asset [ "*" ] || ""

    if ( rawPath.startsWith ( "api/" ) || rawPath === "api" ) {
      return rep.status ( 404 ).send ( "Not Found" )
    }

    if ( rawPath.includes ( ".." ) ) {
      return rep.status ( 400 ).send ( "Bad Request" )
    }

    const clientFolder = await clientFolderPromise
    const address = resolve ( clientFolder, rawPath )

    if ( !address.startsWith ( clientFolder ) ) {
      return rep.status ( 400 ).send ( "Bad Request" )
    }

    try {
      await access ( address, constants.F_OK )
      const stats = await stat ( address )
      if ( stats.isFile ( ) ) {
        const fileExt = extname ( address ).toLowerCase ( )
        const contentType = mime.getType ( fileExt ) || "application/octet-stream"

        if ( HASHED_ASSET_RE.test ( rawPath ) ) {
          rep.header ( "cache-control", "public, max-age=31536000, immutable" )
        } else if ( fileExt === ".html" ) {
          rep.header ( "cache-control", "no-cache, no-store, must-revalidate" )
        }

        const stream = createReadStream ( address )
        return rep.type ( contentType ).send ( stream )
      }
    } catch {
      // fall through to SPA handler
    }

    try {
      const nonce = rep.cspNonce?.script ?? ""
      const indexContent = await fetchIndex ( clientFolder, nonce )
      return rep.type ( "text/html" ).header ( "cache-control", "no-cache, no-store, must-revalidate" ).send ( indexContent )
    } catch {
      return rep.status ( 500 ).send ( "Internal Server Error" )
    }
  } )

  const fetchIndex = async ( clientFolder: string, nonce: string ) => {
    if ( !indexHtmlBase ) {
      indexHtmlBase = await readFile ( join ( clientFolder, "index.html" ), "utf8" )
    }

    let html = indexHtmlBase
    if ( nonce ) {
      const metaTag = `<meta name="csp-nonce" content="${nonce}">`
      html = html.replace ( "</head>", `${metaTag}</head>` )
    }

    html = html.replace (
      /<link rel="modulepreload"(?!\s[^>]*crossorigin)/g,
      '<link rel="modulepreload" crossorigin'
    )

    return injectAnalytics ( html, nonce )
  }

  const injectAnalytics = ( html: string, nonce: string ): string => {
    const cfToken = process.env [ "CF_BEACON_TOKEN" ] ?? "7ca567f04cf7468caa2237e6f7f31d3d"
    const gaId = process.env [ "GA_TRACKING_ID" ] ?? "G-BKXJTC9XPM"
    const scripts: string [ ] = [ ]

    if ( cfToken ) {
      scripts.push (
        `<script data-cfasync="false" nonce="${nonce}" async src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "${cfToken}"}'></script>`
      )
    }

    if ( gaId ) {
      scripts.push (
        `<script data-cfasync="false" nonce="${nonce}" async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
      <script data-cfasync="false" nonce="${nonce}">
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      </script>`
      )
    }

    if ( scripts.length === 0 ) {
      return html
    }

    const bodyIndex = html.indexOf ( "<body>" )
    if ( bodyIndex !== -1 ) {
      return html.slice ( 0, bodyIndex ) + scripts.join ( "\n    " ) + html.slice ( bodyIndex )
    }
    return html + scripts.join ( "\n    " )
  }
}
