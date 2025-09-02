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
  CORS_ORIGINS?: string | string[];
  // Add other bindings, e.g. MY_KV?: KVNamespace;
};
