import { join, normalize, resolve, sep } from "path"
import sharp from "sharp"
import { FastifyPluginAsync } from "fastify"
import rateLimit from "@fastify/rate-limit"
import { isDevMode } from "./static.js"

const IMAGE_DIR = join ( process.cwd ( ), "../", "assets", "img" )

const SUPPORTED_FORMATS = [ "webp", "avif", "jpeg", "png" ]

sharp.cache ( !isDevMode ( ) ? { memory: 50, files: 20 } : false )
sharp.concurrency ( isDevMode ( ) ? 1 : 4 )

const IMAGE_CACHE_MAX = 200
const IMAGE_CACHE_TTL_MS = 60 * 60 * 1000

interface CacheEntry {
  buffer: Buffer
  contentType: string
  expiresAt: number
}

const imageCache = new Map<string, CacheEntry> ( )

const pruneCache = ( ) => {
  const now = Date.now ( )
  for ( const [ key, entry ] of imageCache ) {
    if ( entry.expiresAt < now ) imageCache.delete ( key )
  }
  if ( imageCache.size > IMAGE_CACHE_MAX ) {
    const oldest = [ ...imageCache.keys ( ) ].slice ( 0, imageCache.size - IMAGE_CACHE_MAX )
    oldest.forEach ( k => imageCache.delete ( k ) )
  }
}

export const router: FastifyPluginAsync = async app => {
  await app.register ( rateLimit, {
    max: isDevMode ( ) ? 5000 : 500,
    timeWindow: "1 minute"
  } )

  app.get ( "/*", async ( req, rep ) => {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const asset = req.params as { "*": string }
      const filename = asset [ "*" ]

      if ( !filename ) {
        return rep.status ( 400 ).send ( "Filename is required" )
      }

      const { w, h, f, q } = req.query as { w?: string; h?: string; f?: string; q?: string }

      const MAX_DIMENSION = 4096
      const parsedWidth = w ? parseInt ( w, 10 ) : null
      const parsedHeight = h ? parseInt ( h, 10 ) : null
      const parsedQuality = q ? parseInt ( q, 10 ) : 80

      if ( ( parsedWidth !== null && isNaN ( parsedWidth ) ) ||
           ( parsedHeight !== null && isNaN ( parsedHeight ) ) ||
           isNaN ( parsedQuality ) ) {
        return rep.status ( 400 ).send ( "Invalid query parameters" )
      }

      const width = parsedWidth !== null ? Math.min ( parsedWidth, MAX_DIMENSION ) : null
      const height = parsedHeight !== null ? Math.min ( parsedHeight, MAX_DIMENSION ) : null
      const format = f && SUPPORTED_FORMATS.includes ( f ) ? f : "webp"
      const quality = parsedQuality

      const safeFilename = normalize ( filename ).replace ( /^(\.\.(\/|\\|$))+/, "" )
      const inputPath = resolve ( IMAGE_DIR, safeFilename )

      if ( inputPath !== IMAGE_DIR && !inputPath.startsWith ( IMAGE_DIR + sep ) ) {
        return rep.status ( 400 ).send ( "Bad Request" )
      }

      const cacheKey = req.url
      const cached = imageCache.get ( cacheKey )
      if ( cached && cached.expiresAt > Date.now ( ) ) {
        return rep
          .type ( cached.contentType )
          .header ( "Cache-Control", "public, max-age=604800, stale-while-revalidate=86400" )
          .send ( cached.buffer )
      }

      let transformer = sharp ( inputPath )
        .resize ( width, height, { fit: "inside", withoutEnlargement: true } )

      switch ( format ) {
        case "jpeg":
          transformer = transformer.jpeg ( { quality, progressive: true } )
          break
        case "png":
          transformer = transformer.png ( { quality } )
          break
        case "avif":
          transformer = transformer.avif ( { quality } )
          break
        default:
          transformer = transformer.webp ( { quality } )
      }

      const buffer = await transformer.toBuffer ( )
      pruneCache ( )
      imageCache.set ( cacheKey, {
        buffer,
        contentType: `image/${format === "jpeg" ? "jpeg" : format}`,
        expiresAt: Date.now ( ) + IMAGE_CACHE_TTL_MS
      } )

      return rep
        .type ( format )
        .header ( "Cache-Control", "public, max-age=604800, stale-while-revalidate=86400" )
        .send ( buffer )
    } catch ( err ) {
      console.error ( err )
      return rep.status ( 500 ).send ( "Error processing image" )
    }
  } )
}
