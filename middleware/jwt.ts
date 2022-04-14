import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import throwCustomError from "@/middleware/throwCustomError";

interface URL {
  path: string;
  method: string;
}

const urlsWithoutAuth = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/posts",
  "/api/posts/pages",
  {
    path: "/api/post",
    method: "GET",
  },
];

const jwtMiddleware = (req: NextApiRequest) => {
  const {
    cookies: { token },
    method,
  } = req;

  const path = req.url?.split("?")[0];

  // eslint-disable-next-line no-restricted-syntax
  for (const url of urlsWithoutAuth) {
    if (typeof url === "string" && url === path) return;
    if ((url as URL).path === path && (url as URL).method === method) return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throwCustomError("Auth expired", 401);
  }
};

export default jwtMiddleware;
