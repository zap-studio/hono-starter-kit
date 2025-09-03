import { OpenAPIHono } from "@hono/zod-openapi";
import { API_VERSION } from "@/data/openapi";
import { health } from "@/routes/health.route";
import { HttpStatus } from "@/zap/utils/http";
import { sendJson } from "@/zap/utils/response";

export const healthRouter = new OpenAPIHono<Env>().openapi(health, (c) => {
  return sendJson(
    c,
    { status: "ok", timestamp: Date.now(), version: API_VERSION },
    HttpStatus.OK
  );
});
