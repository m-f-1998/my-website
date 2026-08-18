import Fastify from "fastify"
import zlib from "zlib"

import helmet from "@fastify/helmet"
import compress from "@fastify/compress"
import sensible from "@fastify/sensible"
import formbody from "@fastify/formbody"
import cors from "@fastify/cors"

import { isDevMode, router as staticRouter } from "./routes/static.js"
import { router as imagesRouter } from "./routes/images.js"
import { router as mailerRouter } from "./routes/mailer.js"
import { router as githubRouter } from "./routes/github.js"

const trustProxyEnv = process.env [ "TRUST_PROXY" ]?.trim ( )
const app = Fastify ( {
  logger: false,
  trustProxy: trustProxyEnv && trustProxyEnv.length > 0
    ? ( /^\d+$/.test ( trustProxyEnv ) ? Number ( trustProxyEnv ) : trustProxyEnv )
    : "loopback",
} )

await app.register ( sensible )
await app.register ( formbody )

await app.register ( compress, {
  threshold: 1024,
  zlibOptions: {
    flush: zlib.constants.Z_SYNC_FLUSH
  }
} )

await app.register ( cors, {
  origin: ( origin, callback ) => {
    const corsEnv = process.env [ "CORS_ORIGINS" ]
    const allowedOrigins = corsEnv
      ? corsEnv.split ( "," ).map ( s => s.trim ( ) )
      : [ "http://localhost:4200", "http://localhost:3000", "https://matthewfrankland.co.uk" ]
    if ( !origin || allowedOrigins.includes ( origin ) ) {
      callback ( null, true )
    } else {
      callback ( null, false )
    }
  },
  methods: [ "GET", "POST" ],
  allowedHeaders: [ "Content-Type", "Authorization" ],
  credentials: true
} )

await app.register ( helmet, {
  enableCSPNonces: true,
  crossOriginOpenerPolicy: false,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [ "'none'" ],
      scriptSrc: [
        "'self'",
        "www.googletagmanager.com"
      ],
      styleSrc: [ "'self'" ],
      styleSrcAttr: [ "'unsafe-inline'" ],
      scriptSrcElem: [
        "'self'",
        "https://www.youtube.com",
        "https://www.googletagmanager.com",
        "https://static.cloudflareinsights.com",
        "https://www.google.com",
        "https://www.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://*.jsdelivr.net"
      ],
      connectSrc: [
        "'self'",
        "https://*.google-analytics.com",
        "https://*.google.com"
      ],
      frameSrc: [
        "'self'",
        "https://www.google.com"
      ]
    }
  },
  noSniff: true,
  xssFilter: true,
  ieNoOpen: true
} )

app.get ( "/api/health", async ( _req, rep ) => {
  return rep.send ( { status: "ok", stack: "fastify" } )
} )

app.get ( "/ordo-1962/support", async ( _req, rep ) => {
  return rep.redirect ( "https://ordo.matthewfrankland.co.uk", 301 )
} )

app.get ( "/ordo-1962/v1.3/prayers.php", async ( _req, rep ) => {
  return rep.redirect ( "https://ordo.matthewfrankland.co.uk/api/v1.3/prayers", 301 )
} )

app.get ( "/ordo-1962/v1.3/locale.php", async ( _req, rep ) => {
  return rep.redirect ( "https://ordo.matthewfrankland.co.uk/api/v1.3/locale", 301 )
} )

app.get ( "/ordo-1962/v1.3/ordo.php", async ( req, rep ) => {
  const year = ( req.query as { year?: string } ).year
  if ( !year ) {
    return rep.redirect ( "https://matthewfrankland.co.uk/error/400", 302 )
  }
  return rep.redirect ( `https://ordo.matthewfrankland.co.uk/api/v1.3/ordo/${year}`, 301 )
} )

await app.register ( imagesRouter, { prefix: "/api/img" } )
await app.register ( mailerRouter, { prefix: "/api/mail" } )
await app.register ( githubRouter, { prefix: "/api/github" } )
await app.register ( staticRouter, { prefix: "/" } )

console.log ( `Server starting (${isDevMode ( ) ? "dev" : "production"} mode)...` )

await app.listen ( {
  port: 3000,
  host: "0.0.0.0"
} )

console.log ( "Server running on port 3000" )
