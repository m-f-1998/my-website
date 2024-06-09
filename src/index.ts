import express, { NextFunction, Request, Response } from "express"
import OrdoRouter from "./api/ordo"
import OrdoDeprecatedRouter from "./api/ordo"
import { join } from "path"
import compression from "compression"
import helmet from "helmet"

const app = express ( )
app.use ( compression ( ) )
app.use ( helmet ( ) )
app.disable ( "x-powered-by" )

app.use ( "/", express.static ( join ( __dirname, "matthew-frankland" ) ) )
app.use ( "/revive-scotland", express.static ( join ( __dirname, "revive-scotland" ) ) )
app.use ( "/api", OrdoRouter )
app.use ( OrdoDeprecatedRouter )

app.get ( "*", ( _, res ) => {
  res.status ( 404 ).redirect ( "/404.html" )
} )

app.listen ( 4000, ( ) => {
  console.log ( "Website Running on Port 4000" )
} )

app.use ( ( _err: Error, _req: Request, res: Response, _next: NextFunction ) => {
  switch ( res.statusCode ) {
    case 200:
      break
    default:
      res.redirect ( "/error/" + res.statusCode )
      break
  }
} )