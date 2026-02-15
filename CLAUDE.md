# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fullstack gym exercise search application. Users search for exercises by name and see results with body parts, muscles, equipment, GIF animations, and instructions. Data is sourced from the **ExerciseDB API** (`https://exercisedb.dev/api/v1/exercises/search`) and cached in PostgreSQL.

## Architecture

- **Frontend** (`frontend/`): Next.js 14 (App Router) + Tailwind CSS on port 3000
- **Backend** (`backend/`): NestJS + TypeORM + PostgreSQL on port 3001
- **Database**: PostgreSQL 16 via Docker Compose

Data flow: Frontend → `GET /exercises/search?q=term` → NestJS checks PostgreSQL cache → if miss, fetches from `https://exercisedb.dev/api/v1/exercises/search` → caches and returns results.

## Commands

### Prerequisites
```bash
docker compose up -d  # Start PostgreSQL
```

### Backend
```bash
cd backend
pnpm install
pnpm run start:dev     # Development (watch mode) on :3001
pnpm run build         # Compile TypeScript
pnpm run start:prod    # Production
pnpm run test          # Unit tests
pnpm run test:e2e      # E2E tests
pnpm run lint          # ESLint
```

### Frontend
```bash
cd frontend
pnpm install
pnpm run dev           # Development on :3000
pnpm run build         # Production build
pnpm run lint          # ESLint
```

## Key Files

- `backend/src/exercises/exercises.service.ts` — Core logic: search cache, fetch from ExerciseDB API, cache results
- `backend/src/exercises/exercise.entity.ts` — TypeORM entity for PostgreSQL
- `backend/src/exercises/exercises.controller.ts` — REST endpoint
- `frontend/src/app/page.tsx` — Home page with search UI
- `frontend/src/lib/api.ts` — API client calling the backend
- `frontend/src/components/` — SearchBar, ExerciseCard, ExerciseList
