import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createUserRoute,
  getUserRoute,
  listUsersRoute,
} from "@/routes/example.route";
import { createUser, getUser, listUsers } from "@/services/example.service";
import type { Env } from "@/zap/utils/env";
import { HttpStatus } from "@/zap/utils/http";
import { sendError, sendJson } from "@/zap/utils/response";

export const exampleRouter = new OpenAPIHono<Env>()
  .openapi(listUsersRoute, (c) => {
    const { page = "1", limit = "10", q } = c.req.valid("query");
    const pageNum = Number.parseInt(page, 10);
    const limitNum = Number.parseInt(limit, 10);

    let users = listUsers();
    if (q) {
      const query = q.toLowerCase();
      users = users.filter((user) =>
        Object.values(user)
          .map((v) => String(v).toLowerCase())
          .some((v) => v.includes(query))
      );
    }
    const total = users.length;
    const start = (pageNum - 1) * limitNum;
    const paginated = users.slice(start, start + limitNum);

    return sendJson(c, paginated, HttpStatus.OK, {
      total,
      page: pageNum,
      limit: limitNum,
    });
  })
  .openapi(getUserRoute, (c) => {
    const { id } = c.req.valid("param");
    const user = getUser(id);
    if (!user) {
      return sendError(c, "User not found", HttpStatus.NOT_FOUND);
    }
    return sendJson(c, user, HttpStatus.OK);
  })
  .openapi(createUserRoute, (c) => {
    const input = c.req.valid("json");
    const user = createUser(input);
    return sendJson(c, user, HttpStatus.CREATED);
  });
