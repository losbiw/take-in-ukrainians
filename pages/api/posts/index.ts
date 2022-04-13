import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import ITEMS_PER_PAGE from "@/constants/posts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page: pageParam, offers_only } = req.query;

  const getPosts = async (page: number = 1) => {
    const posts = await sql`
      SELECT * FROM posts
      ${
        typeof offers_only !== "undefined"
          ? sql`WHERE is_offering=${offers_only === "true"}`
          : sql``
      }
      ORDER BY post_id DESC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${(page - 1) * ITEMS_PER_PAGE}
    `;

    if (posts.length > 0) {
      return res.status(200).json({
        posts,
      });
    }

    return res.status(404).json({
      message: "There are no more publications",
    });
  };

  if (req.method === "GET") {
    const parsedPage = parseInt(pageParam as string, 10);

    if (Number.isNaN(parsedPage)) return getPosts();

    return getPosts(parsedPage);
  }

  return res.status(405).end();
}
