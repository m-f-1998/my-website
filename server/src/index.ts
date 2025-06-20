import express from "express"
import helmet from "helmet"

import cors from "cors"
import { router as mailer } from "./routes/mailer.js"

const app = express ( )

app.use ( express.json ( ) )
app.use ( express.urlencoded ( { extended: true } ) )

app.use ( express.json ( { limit: "1mb" } ) )
app.use ( express.urlencoded ( { limit: "1mb", extended: true } ) )

app.use ( cors ( {
  origin: [ "http://localhost:4200", "https://matthewfrankland.co.uk" ],
  methods: [ "GET", "POST" ],
  allowedHeaders: [ "Content-Type", "Authorization" ],
  credentials: true
} ) )

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
      defaultSrc: [ "'self'" ],
      scriptSrc: [ "'self'", "'unsafe-inline'", "https://www.google.com/recaptcha/api.js" ],
      styleSrc: [ "'self'", "'unsafe-inline'" ],
      imgSrc: [ "'self'", "data:", "https://www.google.com/recaptcha/api/image" ],
      connectSrc: [ "'self'", "https://www.google.com/recaptcha/api/siteverify" ]
    }
  },
  noSniff: true,
  xssFilter: true,
  ieNoOpen: true
} ) )

app.use ( mailer )

app.listen ( 3000, ( ) => {
  console.log ( "Server running on port 3000" )
} )
