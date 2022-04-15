import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
import parseJwt from "@/helpers/parseJwt";
import apiHandler from "@/middleware/api";

export const getUsersPosts = async (userId: number) => {
  const posts = await sql`
    SELECT * FROM posts
    WHERE user_id=${userId}
  `;

  if (posts) {
    return posts;
  }

  throw new ApiError(401, "No user's posts were found");
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    cookies: { token },
    method,
  } = req;
  const { user_id } = parseJwt(token);

  switch (method) {
    case "GET":
      return res.json({ posts: getUsersPosts(user_id) });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
