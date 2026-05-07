import express, { Router, Request } from "express"
import type { Response } from "express"
import { join } from "path"
import { existsSync } from "fs"
import { readFile } from "fs/promises"

export const router = Router ( )

router.use ( express.static ( join ( process.cwd ( ), "../client" ), {
  maxAge: "1y",
  immutable: true,
  etag: true,
  index: false,
  setHeaders: ( res, filePath ) => {
    // index.html must never be cached long-term (it has no content hash)
    if ( filePath.endsWith ( "index.html" ) ) {
      res.setHeader ( "Cache-Control", "no-cache, no-store, must-revalidate" )
    }
  }
} ) )

router.get ( "*get", async ( _req: Request, res: Response ) => {
  const indexPath = join ( process.cwd ( ), "../client/index.html" )
  if ( existsSync ( indexPath ) ) {
    const html = await readFile ( indexPath, "utf8" )
    const nonce = res.locals [ "cspNonce" ]
    const metaTag = `<meta name="csp-nonce" content="${nonce}">`
    let updatedHtml = html.replace ( "</head>", `${metaTag}</head>` )
    // Angular emits modulepreload links without crossorigin; add it so the
    // browser can reuse the preload when the ES module is fetched with CORS.
    updatedHtml = updatedHtml.replace (
      /<link rel="modulepreload"(?!\s[^>]*crossorigin)/g,
      '<link rel="modulepreload" crossorigin'
    )
    res.send ( injectGoogleTagManager ( updatedHtml, nonce ) )
  } else {
    res.status ( 404 ).send ( "Index file not found." )
  }
} )

const injectGoogleTagManager = ( html: string, nonce: string ): string => {
  // data-cfasync="false" opts these scripts out of Cloudflare Rocket Loader,
  // which otherwise proxies them and can cause cert errors in non-prod environments.
  const gtmScript = `<script data-cfasync="false" nonce="${nonce}" async src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "7ca567f04cf7468caa2237e6f7f31d3d"}'></script>
    <script data-cfasync="false" nonce="${nonce}" async src="https://www.googletagmanager.com/gtag/js?id=G-BKXJTC9XPM"></script>
    <script data-cfasync="false" nonce="${nonce}">
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-BKXJTC9XPM');
    </script>`

  const bodyIndex = html.indexOf ( "<body>" )
  if ( bodyIndex !== -1 ) {
    return html.slice ( 0, bodyIndex ) + gtmScript + html.slice ( bodyIndex )
  }
  return html + gtmScript
}