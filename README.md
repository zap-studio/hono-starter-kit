# Hono Starter Kit

A modern, type-safe starter template for building Cloudflare Workers APIs with [Hono](https://hono.dev/).

## Features

- ⚡️ Fast, minimal API routing with Hono
- 🦺 Strict type safety (Cloudflare Bindings)
- 🧩 Modular structure: routes, services, schemas, middlewares, utils
- 🛠️ Biome with Ultracite for formatting & linting
- 🧪 Vitest for testing
- 🚀 Ready for local dev & Cloudflare deployment

## Getting Started

### 1. Install dependencies

```sh
bun install
```

### 2. Start local development

```sh
bun run dev
```

### 3. Deploy to Cloudflare

```sh
bun run deploy
```

### 4. Generate Cloudflare types

To sync types from your Worker configuration:

```sh
bun run cf-typegen
```

## Usage

### Type-safe API

When creating your Hono app, pass the Cloudflare bindings for full type safety:

```ts
// src/index.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import type { RequestIdVariables } from "hono/request-id";

const app = new OpenAPIHono<{
  Bindings: CloudflareBindings;
  Variables: RequestIdVariables;
}>();
```

### OpenAPI and Scalar UI

Your Hono app automatically exposes:

- **OpenAPI docs** at `/api/v1/docs` (OpenAPI 3.1)
- **Scalar UI** at `/api/v1/scalar` (interactive API explorer)
- **llms.txt** at `/api/v1/llms.txt` (OpenAPI as Markdown for LLMs)

## Project Structure

```
src/
  index.ts                  # App entry point (auto docs, Scalar UI, llms.txt)
  data/
    base-path.ts            # Base path configuration
    openapi.ts              # OpenAPI helpers
  lib/
    env.ts                  # Environment variable helpers
    hc.ts                   # Health check helpers
  routers/
    example.router.ts       # Example router
    health.router.ts        # Health check router
    scalar.router.ts        # Scalar UI router
  routes/
    example.route.ts        # Example API route
    health.route.ts         # Health check route
  schemas/
    example.schema.ts       # Example validation schema
    health.schema.ts        # Health check schema
  services/
    example.service.ts      # Example business logic
  zap/
    middlewares/
      cors.middleware.ts    # Custom CORS middleware
      rate-limit.middleware.ts # Rate limiting middleware
    schemas/
      response.schema.ts    # Response schema
    utils/
      env.ts               # Environment variable helpers (Zap)
      http.ts              # HTTP helpers
      parsing.ts           # Parsing utilities
      response.ts          # Response formatting
      zod.ts               # Zod helpers
```

## Scripts

- `bun run dev` — Start local dev server
- `bun run deploy` — Deploy to Cloudflare
- `bun run cf-typegen` — Generate/sync Cloudflare types

## Linting & Formatting

Uses [Biome](https://biomejs.dev/) with [Ultracite](https://ultracite.ai/) for code quality:

```sh
bun run lint     # Check for issues
bun run format   # Auto-fix & format
```

## Testing

Run unit tests with Vitest:

```sh
bun run test
bun run test:watch
bun run coverage
```

## Resources

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Scalar UI](https://scalar.com/)
- [Ultracite](https://www.ultracite.ai/)
