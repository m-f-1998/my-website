import { FastifyPluginAsync } from "fastify"
import rateLimit from "@fastify/rate-limit"
import { createTransport, type Transporter } from "nodemailer"
import { config } from "dotenv"
import { resolve } from "path"
import sanitizeHtml from "sanitize-html"
import { isDevMode } from "./static.js"

config ( { path: resolve ( process.cwd ( ), ".env" ), quiet: true } )

const mailFrom = ( ): string => {
  return process.env [ "MAIL_FROM" ] || process.env [ "SMTP_USER" ] || "dev@localhost"
}

const mailTo = ( ): string => {
  return process.env [ "MAIL_TO" ] || process.env [ "SMTP_USER" ] || "dev@localhost"
}

const hasSmtpConfig = ( ): boolean => {
  return Boolean (
    process.env [ "SMTP_SERVICE" ] &&
    process.env [ "SMTP_USER" ] &&
    process.env [ "SMTP_PASS" ]
  )
}

export const createMailTransporter = ( ): Transporter => {
  if ( hasSmtpConfig ( ) ) {
    return createTransport ( {
      service: process.env [ "SMTP_SERVICE" ],
      auth: {
        user: process.env [ "SMTP_USER" ]!,
        pass: process.env [ "SMTP_PASS" ]!,
      },
    } )
  }

  if ( isDevMode ( ) ) {
    return createTransport ( { jsonTransport: true } )
  }

  throw new Error ( "SMTP not configured" )
}

export const verifyMailTransport = async ( ): Promise<void> => {
  if ( isDevMode ( ) || !hasSmtpConfig ( ) ) {
    return
  }

  const transporter = createMailTransporter ( )
  const service = process.env [ "SMTP_SERVICE" ]

  try {
    await transporter.verify ( )
    console.log ( `SMTP ready (service:${service})` )
  } catch ( err ) {
    const message = err instanceof Error ? err.message : String ( err )
    console.error ( `SMTP verify failed (service:${service}):`, message )
    console.error ( "Mail tips: iCloud uses SMTP_SERVICE=icloud with an app-specific password." )
  }
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
        } ),
        signal: AbortSignal.timeout ( 15_000 )
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
    if ( err instanceof Error && err.name === "TimeoutError" ) {
      return { ok: false, status: 504, message: "reCAPTCHA verification timed out." }
    }

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

    const sanitized = sanitizeHtml ( message, {
      allowedTags: sanitizeHtml.defaults.allowedTags,
      allowedAttributes: sanitizeHtml.defaults.allowedAttributes
    } )

    try {
      if ( hasSmtpConfig ( ) ) {
        const transporter = createMailTransporter ( )
        const result = await transporter.sendMail ( {
          from: mailFrom ( ),
          to: mailTo ( ),
          subject,
          html: sanitized,
          encoding: "utf8",
        } )

        if ( isDevMode ( ) ) {
          console.log ( "[dev mail]", { subject, message: sanitized, result } )
          return rep.status ( 200 ).send ( {
            message: "Email captured in dev mode (check server console).",
            dev: true
          } )
        }
      } else if ( isDevMode ( ) ) {
        console.log ( "[dev mail]", { subject, message: sanitized } )
        return rep.status ( 200 ).send ( {
          message: "Email captured in dev mode (check server console).",
          dev: true
        } )
      }

      return rep.status ( 200 ).send ( { message: "Email sent successfully" } )
    } catch ( err ) {
      const errMessage = err instanceof Error ? err.message : "Unknown error"
      console.error ( "Email send failed:", errMessage, err )
      return rep.status ( 500 ).send ( {
        message: "Email send failed. Please try again later or email admin@matthewfrankland.co.uk directly."
      } )
    }
  } )
}
