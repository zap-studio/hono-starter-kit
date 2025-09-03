import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { PREFIX, VERSION } from "@/data/base-path";
import { OPENAPI_DOC_ROUTE } from "@/data/openapi";
import type { Env } from "@/zap/utils/env";

export const scalarRouter = new OpenAPIHono<Env>().get(
  "/",
  Scalar({ url: `${PREFIX}${VERSION}${OPENAPI_DOC_ROUTE}` })
);
