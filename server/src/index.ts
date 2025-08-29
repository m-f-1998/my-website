import express from "express"
// import type { Response } from "express"
import helmet from "helmet"

import cors from "cors"
import { router as mailerRouter } from "./routes/mailer.js"
import { router as staticRouter } from "./routes/static.js"
import { randomBytes } from "crypto"
import { rateLimit } from "express-rate-limit"

const app = express ( )

app.use ( express.json ( ) )
app.use ( express.urlencoded ( { extended: true } ) )

app.use ( express.json ( { limit: "1mb" } ) )
app.use ( express.urlencoded ( { limit: "1mb", extended: true } ) )

app.use ( cors ( {
  origin: [ "http://localhost:3000", "https://matthewfrankland.co.uk" ],
  methods: [ "GET", "POST" ],
  allowedHeaders: [ "Content-Type", "Authorization" ],
  credentials: true
} ) )

app.use ( ( _req, res, next ) => {
  const nonce = randomBytes ( 16 ).toString ( "base64" )
  res.locals [ "cspNonce" ] = nonce
  next ( )
} )

app.use ( helmet ( {
  frameguard: {
    action: "deny"
  },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'none'",
      ],
      scriptSrc: [
        "'self'",
        "www.googletagmanager.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        // ( _req, res ) => `'nonce-${( res as Response ).locals[ "cspNonce" ]}'`,
      ],
      scriptSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://www.youtube.com",
        "https://www.googletagmanager.com",
        "https://static.cloudflareinsights.com"
        // ( _req, res ) => `'nonce-${( res as Response ).locals[ "cspNonce" ]}'`
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://\*.jsdelivr.net",
      ],
      connectSrc: [
        "'self'",
        "https://\*.google-analytics.com",
        "https://\*.google.com",
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
} ) )

app.use ( "/assets", rateLimit ( {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
} ) )

app.get ( "/ordo-1962/support", ( _req, res ) => {
  res.redirect ( 301, "https://ordo.matthewfrankland.co.uk" )
} )

app.get ( "/ordo-1962/v1.3/prayers.php", ( _req, res ) => {
  res.redirect ( 301, "https://ordo.matthewfrankland.co.uk/api/v1.3/prayers" )
} )

app.get ( "/ordo-1962/v1.3/locale.php", ( _req, res ) => {
  res.redirect ( 301, "https://ordo.matthewfrankland.co.uk/api/v1.3/locale" )
} )

app.get ( "/ordo-1962/v1.3/ordo.php", ( req, res ) => {
  const year = req.query [ "year" ] as string | undefined
  if ( !year ) {
    return res.redirect ( 302, "https://matthewfrankland.co.uk/error/400" )
  }
  res.redirect ( 301, `https://ordo.matthewfrankland.co.uk/api/v1.3/ordo/${year}` )
} )

app.use ( mailerRouter )
app.use ( staticRouter )

app.listen ( 3000, ( ) => {
  console.log ( "Server running on port 3000" )
} )
