import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import ITEMS_PER_PAGE from "@/constants/posts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const getPostsCount = async () => {
    const postsNumber = await sql`
      SELECT COUNT(post_id)
      FROM posts
    `;

    return res.status(200).json({
      status: "success",
      pages: postsNumber.length / ITEMS_PER_PAGE,
    });
  };

  switch (req.method) {
    case "GET":
      return getPostsCount();
    default:
      return res.status(405);
  }
}
