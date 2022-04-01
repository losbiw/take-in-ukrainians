import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import ITEMS_PER_PAGE from "@/constants/posts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const getPosts = async (page: number = 0) => {
    const posts = await sql`
      SELECT * FROM posts
      ORDER BY post_id
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${page * ITEMS_PER_PAGE}
    `;

    if (posts.length > 0) {
      return res.status(200).json({
        status: "success",
        posts,
      });
    }

    return res.status(404).json({
      message: "There are no more publications",
    });
  };

  if (req.method === "GET") {
    const pageParam = req.query.page;
    const parsedPage = parseInt(pageParam as string, 10);

    if (Number.isNaN(parsedPage)) return getPosts();

    return getPosts(parsedPage);
  }

  return res.status(405).end();
}
