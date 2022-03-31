import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import ITEMS_PER_PAGE from "@/constants/posts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const getPosts = async (offset: number) => {
    const posts = await sql`
      SELECT * FROM posts
      ORDER BY post_id
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset}
    `;

    if (posts.length > 0) {
      return res.status(200).json({
        status: "success",
        posts,
      });
    }

    return res.status(404).json({
      status: "error",
      error: "There are no more publications",
    });
  };

  switch (req.method) {
    case "GET":
      if (typeof req.query.page !== "string") {
        return res.status(401).json({
          status: "error",
          message: 'The "page" parameter type is invalid',
        });
      }

      return getPosts(parseInt(req.query.page, 10));
    default:
      return res.status(405);
  }
}
