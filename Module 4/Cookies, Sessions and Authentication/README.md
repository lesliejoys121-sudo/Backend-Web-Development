# LU48 Starter — Session Authentication

## Setup

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

Set `COOKIE_SECRET` in `.env` to at least 32 random characters. Keep `COOKIE_SECURE=false` for local HTTP; production must use HTTPS with `COOKIE_SECURE=true`.

Seeded demo account: `sam@example.com` / `SessionDemo!48`.

## Implement

Complete the TODOs in:

- `src/routes/authRoutes.js`
- `src/session/sessionStore.js`
- `src/middleware/requireSession.js`

Required endpoints: `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`.

Use Postman cookie jar or curl `-c cookies.txt` and `-b cookies.txt` to preserve the cookie between requests.

The session store in `src/session/sessionStore.js` is an in-memory learning implementation:
restarting the process clears sessions, and multiple application instances cannot share it.
Production deployments should use a shared expiring store such as Redis.
