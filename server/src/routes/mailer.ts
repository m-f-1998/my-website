import { FastifyPluginAsync } from "fastify"
import rateLimit from "@fastify/rate-limit"
import { createTransport, type Transporter } from "nodemailer"
import { config } from "dotenv"
import { resolve } from "path"
import sanitizeHtml from "sanitize-html"
import { isDevMode } from "./static.js"

config ( { path: resolve ( process.cwd ( ), ".env" ), quiet: true } )

const hasSmtpConfig = ( ): boolean => {
  return Boolean (
    process.env [ "SMTP_HOST" ] &&
    process.env [ "SMTP_PORT" ] &&
    process.env [ "SMTP_USER" ] &&
    process.env [ "SMTP_PASS" ]
  )
}

const createMailTransporter = ( ): Transporter => {
  if ( hasSmtpConfig ( ) ) {
    return createTransport ( {
      host: process.env [ "SMTP_HOST" ],
      port: Number ( process.env [ "SMTP_PORT" ] ),
      secure: Number ( process.env [ "SMTP_PORT" ] ) === 465,
      auth: {
        user: process.env [ "SMTP_USER" ],
        pass: process.env [ "SMTP_PASS" ],
      },
    } )
  }

  if ( isDevMode ( ) ) {
    return createTransport ( { jsonTransport: true } )
  }

  throw new Error ( "SMTP not configured" )
}

const verifyRecaptcha = async ( recaptchaToken: string ): Promise<{ ok: true } | { ok: false; status: number; message: string }> => {
  if ( isDevMode ( ) ) {
    return { ok: true }
  }

  if ( !process.env [ "RECAPTCHA_API_KEY" ] || !process.env [ "RECAPTCHA_SITE" ] ) {
    return { ok: false, status: 500, message: "reCAPTCHA is not configured on the server." }
  }

  try {
    const response = await fetch (
      "https://recaptchaenterprise.googleapis.com/v1/projects/my-website-445409/assessments?key=" + process.env [ "RECAPTCHA_API_KEY" ],
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Referer": process.env [ "PUBLIC_DOMAIN" ] || ""
        },
        body: JSON.stringify ( {
          event: {
            token: recaptchaToken,
            siteKey: process.env [ "RECAPTCHA_SITE" ],
            expectedAction: "contactForm"
          }
        } )
      }
    )

    if ( !response.ok ) {
      return { ok: false, status: 500, message: "reCAPTCHA verification failed." }
    }

    const data = await response.json ( ) as {
      tokenProperties: { valid: boolean }
      riskAnalysis: { score: number }
    }

    if ( !data.tokenProperties.valid || data.riskAnalysis.score < 0.5 ) {
      console.warn ( "reCAPTCHA verification failed:", data )
      return { ok: false, status: 400, message: "reCAPTCHA failed." }
    }

    return { ok: true }
  } catch ( err ) {
    console.error ( "reCAPTCHA verification error:", err )
    return { ok: false, status: 500, message: "reCAPTCHA verification error." }
  }
}

export const router: FastifyPluginAsync = async app => {
  await app.register ( rateLimit, {
    max: isDevMode ( ) ? 100 : 20,
    timeWindow: "1 hour"
  } )

  app.post ( "/", async ( req, rep ) => {
    if ( !isDevMode ( ) && !hasSmtpConfig ( ) ) {
      return rep.status ( 500 ).send ( { message: "Server configuration error." } )
    }

    const body = ( req.body || { } ) as {
      subject?: string
      message?: string
      recaptchaToken?: string
    }

    const { subject, message, recaptchaToken } = body

    if ( !subject || !message ) {
      return rep.status ( 400 ).send ( { message: "Invalid input." } )
    }

    if ( !isDevMode ( ) && !recaptchaToken ) {
      return rep.status ( 400 ).send ( { message: "Invalid input." } )
    }

    const recaptcha = await verifyRecaptcha ( recaptchaToken || "" )
    if ( !recaptcha.ok ) {
      return rep.status ( recaptcha.status ).send ( { message: recaptcha.message } )
    }

    let transporter: Transporter
    try {
      transporter = createMailTransporter ( )
    } catch {
      return rep.status ( 500 ).send ( {
        message: "Server configuration error. Set DEV_MODE=true for local testing, or configure SMTP in .env."
      } )
    }

    const sanitized = sanitizeHtml ( message, {
      allowedTags: sanitizeHtml.defaults.allowedTags,
      allowedAttributes: sanitizeHtml.defaults.allowedAttributes
    } )

    try {
      const result = await transporter.sendMail ( {
        from: process.env [ "SMTP_USER" ] || "dev@localhost",
        to: process.env [ "SMTP_USER" ] || "dev@localhost",
        subject,
        html: sanitized,
        encoding: "utf8"
      } )

      if ( isDevMode ( ) && !hasSmtpConfig ( ) ) {
        console.log ( "[dev mail]", { subject, message: sanitized, result } )
        return rep.status ( 200 ).send ( {
          message: "Email captured in dev mode (check server console).",
          dev: true
        } )
      }

      return rep.status ( 200 ).send ( { message: "Email sent successfully" } )
    } catch ( err ) {
      const errMessage = err instanceof Error ? err.message : "Unknown error"
      return rep.status ( 500 ).send ( { message: "Email send failed", error: errMessage } )
    }
  } )
}
