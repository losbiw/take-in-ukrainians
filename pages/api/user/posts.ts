import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import verifyJWT from "@/helpers/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user_id: JWTUserId } = verifyJWT.server(req, res);

  if (!JWTUserId) return res.redirect("/");

  const getPosts = async (userId: number) => {
    const posts = await sql`
      SELECT * FROM posts
      WHERE user_id=${userId}
    `;

    if (posts) {
      return res.status(200).json({
        posts,
      });
    }

    return res.status(404).json({
      key: "user_doesnt_have_posts",
      message: "The user doesn't have any posts",
    });
  };

  if (req.method === "GET") {
    return getPosts(JWTUserId);
  }

  return res.status(405).end();
}
