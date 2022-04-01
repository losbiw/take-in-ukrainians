/* eslint-disable consistent-return */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import invalidateJWT from "@/helpers/jwt";

const nonAuthRoutes = [
  "auth/login",
  "auth/signup",
  "posts",
  "posts/count",
  { href: "post", method: "GET" },
];

// eslint-disable-next-line import/prefer-default-export
export async function middleware(req: NextRequest) {
  const {
    url,
    cookies: { token },
  } = req;

  const { pathname } = new URL(url);

  // eslint-disable-next-line no-restricted-syntax
  for (const route of nonAuthRoutes) {
    const routePath = typeof route === "string" ? route : route.href;

    if (
      pathname === `/api/${routePath}` &&
      (typeof route === "string" || route.method === req.method)
    ) {
      return NextResponse.next();
    }
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof verified !== "string") {
      const { userId, isAdmin } = verified;

      req.JWTUserId = userId;
      req.JWTIsAdmin = isAdmin;
    }

    return NextResponse.next();
  } catch {
    invalidateJWT();
  }
}
