import express, { Router } from "express"
import type { Response } from "express"
import { join } from "path"
import { existsSync } from "fs"

export const router = Router ( )

router.use ( express.static ( join ( process.cwd ( ), "../client/dist/browser" ), {
  maxAge: "1d",
  etag: true,
  index: false,
} ) )

router.get ( "*get", ( _, res: Response ) => {
  const indexPath = join ( process.cwd ( ), "../client/dist/browser/index.html" )
  if ( existsSync ( indexPath ) ) {
    res.sendFile ( indexPath )
  } else {
    res.status ( 404 ).send ( "Index file not found." )
  }
} )