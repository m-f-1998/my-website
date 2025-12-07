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

The backend server requires the following environment variables to function properly:

| Variable              | Description                         |
|-----------------------|-------------------------------------|
| `RECAPTCHA_SITE`           | Google reCAPTCHA site key for client-side verification             |
| `RECAPTCHA_API_KEY`        | Google reCAPTCHA API key for server-side requests                  |
| `PUBLIC_DOMAIN`            | Public domain for the application (e.g., `http://localhost:3000`)  |
| `SMTP_HOST`           | SMTP server hostname (e.g., `smtp.gmail.com`) |
| `SMTP_USER`           | SMTP login username (usually your email address) |
| `SMTP_PASS`           | SMTP login password or app-specific password |
| `SMTP_PORT`           | SMTP server port (typically `465` for SSL or `587` for TLS) |

## 📁 Example `.env` (for local dev)

```env
RECAPTCHA_SITE=
RECAPTCHA_API_KEY=
PUBLIC_DOMAIN=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
SMTP_PORT=465


