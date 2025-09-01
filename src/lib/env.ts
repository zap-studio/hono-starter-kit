import type { Hono } from 'hono';
import type { BlankSchema } from 'hono/types';

// Extend this type for your Worker bindings
export type Bindings = {
  APP: Hono<
    {
      Bindings: Bindings;
    },
    BlankSchema,
    '/'
  >;
  PORT?: number;
  NODE_ENV?: string;
  RATE_LIMIT_POINTS?: number;
  RATE_LIMIT_DURATION?: number;
  CORS_ORIGINS?: string[];
  // Add other bindings, e.g. MY_KV?: KVNamespace;
};
