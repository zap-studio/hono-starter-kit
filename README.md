# Hono Starter Kit

A modern, type-safe starter template for building Cloudflare Workers APIs with [Hono](https://hono.dev/).

## Features

- ⚡️ Fast, minimal API routing with Hono
- 🦺 Strict type safety (Cloudflare Bindings)
- 🧩 Modular structure: routes, services, schemas, middlewares, utils
- 🛠️ Biome w/ Ultracite for formatting & linting
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

## Project Structure

```
src/
  index.ts                # App entry point
  lib/
    env.ts                # Environment variable helpers
  routes/
    example.route.ts      # Example API route
    health.route.ts       # Health check route
  schemas/
    example.schema.ts     # Example validation schema
    health.schema.ts      # Health check schema
  services/
    example.service.ts    # Example business logic
  zap/
    middlewares/
      custom-cors.ts      # Custom CORS middleware
    utils/
      http.ts             # HTTP helpers
      parsing.ts          # Parsing utilities
      response.ts         # Response formatting
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
