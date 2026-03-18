# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application for "Starter Studio" - a Hebrew (RTL) digital agency website featuring:
- Landing page with GSAP scroll animations
- Contact form with Telegram integration and 24h rate limiting
- shadcn/ui component library with Tailwind CSS v4
- Prisma with SQLite for database
- Caddy reverse proxy with dynamic port routing via `XTransformPort` query parameter

## Tech Stack

- **Runtime**: Bun (package manager, dev server)
- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4, CSS variables for theming (HSL)
- **UI Components**: Radix UI primitives via shadcn/ui
- **Animations**: GSAP + ScrollTrigger
- **Database**: Prisma ORM with SQLite (file: `./db/custom.db`)
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner (toast)
- **State**: Zustand

## Common Commands

```bash
# Development (uses .zscripts/dev.sh on Unix-like systems)
bun install          # Install dependencies
bun run dev          # Start Next.js dev server on port 3000
bun run build        # Production build (outputs to .next/standalone)

# Database
bun run db:push      # Push schema changes to database (no migration file)
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Create and apply migration
bun run db:reset     # Reset database (destructive)

# Linting
bun run lint         # Run ESLint
```

## Architecture

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── contact/route.ts    # Contact form POST endpoint with Telegram + rate limiting
│   │   └── health/route.ts     # Health check endpoint
│   ├── layout.tsx              # Root layout with RTL, toasters
│   ├── page.tsx                # Single-page landing with GSAP animations
│   └── globals.css             # Global CSS with CSS variable theming
├── components/ui/              # shadcn/ui components (Radix UI + Tailwind)
├── hooks/
│   ├── use-mobile.ts           # Responsive breakpoint hook
│   └── use-toast.ts            # Toast notification hook
└── lib/
    ├── db.ts                   # Prisma client singleton (global cache)
    └── utils.ts                # cn() helper for class merging
```

### Key Patterns

**RTL (Right-to-Left)**: The entire app is Hebrew-first. Layout uses `dir="rtl"` attribute. All text content is in Hebrew.

**API Communication**: The contact form (`page.tsx`) uses hardcoded `http://204.168.171.222:3000` as API fallback. Environment variable `NEXT_PUBLIC_API_URL` overrides this.

**Rate Limiting**: Contact form uses both localStorage (client-side) AND httpOnly cookies (server-side) with 24h cooldown named `last_submission`.

**WebSocket/Mini-Services**: The `examples/websocket/` shows pattern for connecting to backend services via Caddy's `XTransformPort` query parameter routing. Never hardcode ports - always use query parameter.

**Caddy Reverse Proxy**:
- Default proxy to `localhost:3000`
- Dynamic port routing via `?XTransformPort=PORT` query parameter
- Enables frontend on port 3000 to reach backend services on other ports

### Database

Prisma schema defines User and Post models (basic scaffolding). SQLite database file: `./db/custom.db`.

### Theming

CSS variables in `globals.css` use HSL format for light/dark mode support:
```
--background, --foreground, --primary, --muted, --accent, --destructive
```
Tailwind config extends these via `hsl(var(--name))`.

## Build & Deployment

The `.zscripts/` directory contains shell scripts for full-stack deployment (Linux/Unix):
- `dev.sh` - Starts dev server + mini-services with health checks
- `build.sh` - Builds Next.js + mini-services, packages to tar.gz
- `start.sh` - Production startup script for Caddy + services

For Windows development, use `bun run` commands directly from `package.json`.

## Environment Variables

Required for contact form:
- `TELEGRAM_BOT_TOKEN` - Bot token for sending form submissions
- `TELEGRAM_CHAT_ID` - Chat ID to receive messages

Optional:
- `NEXT_PUBLIC_API_URL` - Override default API URL for contact form
- `DATABASE_URL` - Prisma database connection (defaults to file:./db/custom.db)

## Notes

- The `mini-services/` directory is for additional backend services (currently empty, only `.gitkeep`)
- ESLint is configured with `@eslint/js` + `eslint-config-next`
- TypeScript strict mode enabled, but `noImplicitAny` is false
