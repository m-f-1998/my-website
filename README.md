# matthewfrankland.co.uk 🌐
The personal website of [Matthew Frankland](https://www.matthewfrankland.co.uk) — built using Angular and Node.js, containerized with Docker.

## 🌱 Features
- Modern Angular frontend
- TypeScript backend (Node.js)
- Built and deployed with GitHub Actions
- Dev and Production branches
- Image hosted on GHCR

## 🚀 Deployment

Images are published to:
- `ghcr.io/m-f-1998/my-website:dev` – Dev (`beta.*`)
- `ghcr.io/m-f-1998/my-website:latest` – Production

## 🐳 Local Development

```bash
./dev.sh # Docker Compose Local Development Server on Port 3000
./deploy.sh ${dev|latest} # Deploy Package (Requires GHCR Access Token)
```

## 🔧 Required Environment Variables

For **local development**, copy `server/.env.example` to `server/.env` and set `DEV_MODE=true`. In dev mode the contact form logs emails to the server console (no SMTP required) and skips reCAPTCHA verification.

The backend server requires the following environment variables in **production**:

| Variable              | Description                         |
|-----------------------|-------------------------------------|
| `DEV_MODE`            | Set to `true` for local dev (relaxed mail + reCAPTCHA) |
| `RECAPTCHA_SITE`           | Google reCAPTCHA site key for client-side verification             |
| `RECAPTCHA_API_KEY`        | Google reCAPTCHA API key for server-side requests                  |
| `PUBLIC_DOMAIN`            | Public domain for the application (e.g., `http://localhost:3000`)  |
| `SMTP_SERVICE`        | Nodemailer preset — iCloud: `icloud` |
| `SMTP_USER`           | SMTP login username (usually your email address) |
| `SMTP_PASS`           | SMTP app-specific password |
| `MAIL_FROM`           | Optional sender address (defaults to `SMTP_USER`) |
| `MAIL_TO`             | Optional inbox for contact form submissions (defaults to `SMTP_USER`) |

## 📁 Example `.env` (for local dev)

```env
DEV_MODE=true

# Optional in dev — emails are logged to the server console instead
# SMTP_SERVICE=icloud
# SMTP_USER=
# SMTP_PASS=
```

## 📁 Example `.env` (for production)

```env
RECAPTCHA_SITE=
RECAPTCHA_API_KEY=
PUBLIC_DOMAIN=

# iCloud Mail
SMTP_SERVICE=icloud
SMTP_USER=admin@matthewfrankland.co.uk
SMTP_PASS=<app-specific-password-from-appleid.apple.com>
```
