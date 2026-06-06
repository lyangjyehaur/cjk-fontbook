# CJK Fontbook

CJK Fontbook is an MVP catalog site for discovering, filtering, and previewing open-source fonts for Chinese, Japanese, and Korean. It focuses on font discovery and preview rather than hosting font downloads.

## Tech Stack

- Astro in static output mode
- TypeScript
- Preact islands
- Tailwind CSS
- PostgreSQL with Drizzle ORM

## Prerequisites

- Node.js
- PostgreSQL

## Install Dependencies

```bash
npm install
```

## Set Up The Database

Create a PostgreSQL database and copy the example environment file:

```bash
createdb cjk_fontbook
cp .env.example .env
```

Update `DATABASE_URL` in `.env` if your local PostgreSQL credentials differ.

## Run Migrations

```bash
npx drizzle-kit push
```

## Seed Data

```bash
npx tsx scripts/seed.ts
```

## Start Dev Server

```bash
npm run dev
```

## Build For Production

```bash
npm run build
```
