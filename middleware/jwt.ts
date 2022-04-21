import { NextApiRequest } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";

const urlsWithoutAuth = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/recovery",
  "/api/posts",
  "/api/posts/pages",
  {
    path: "/api/post",
    method: "GET",
  },
];

const jwtMiddleware = async (req: NextApiRequest) => {
  const {
    cookies: { token: cookieToken },
    query: { token: queryToken },
    method,
  } = req;

  const path = req.url?.split("?")[0];

  // eslint-disable-next-line no-restricted-syntax
  for (const url of urlsWithoutAuth) {
    if (typeof url === "string" && url === path) return;

    if (typeof url !== "string" && url.path === path && url.method === method)
      return;
  }

  try {
    const { user_id } = jwt.verify(
      cookieToken || (queryToken as string),
      process.env.JWT_SECRET
    ) as JwtPayload;

    const [user] = await sql`
      SELECT email
      FROM users
      WHERE user_id=${user_id as number}
    `;

    if (!user?.email) {
      throw new ApiError(401, "Authentication failed");
    }
  } catch {
    throw new ApiError(401, "Authentication failed");
  }
};

export default jwtMiddleware;
