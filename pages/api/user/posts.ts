import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import throwCustomError from "@/middleware/throwCustomError";
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

  throwCustomError("user_doesnt_have_posts", 404);
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
      throwCustomError("Method not allowed", 405);
  }
};

export default apiHandler(handler);
