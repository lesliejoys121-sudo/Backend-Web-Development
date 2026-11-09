# Database Integration Assignment Starter

Replace the in-memory repository implementation with PostgreSQL through Prisma. The starter already uses an asynchronous repository contract so services and controllers can remain stable during the swap.

## Run

```bash
npm install
npm start
```

## Prisma preparation

Copy `.env.example` to `.env` with a local PostgreSQL URL. The schema is intentionally incomplete for the assignment.

```bash
npm run prisma:format
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

`prisma:migrate` applies the committed migration history. `prisma:seed` safely resets the local tables and inserts two example posts. Never commit `.env` or real credentials.
