import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import ITEMS_PER_PAGE from "@/constants/posts";
import throwCustomError from "@/middleware/throwCustomError";
import apiHandler from "@/middleware/api";

const getNumberOfPages = async () => {
  const posts = await sql`
    SELECT post_id
    FROM posts
  `;

  return posts.length / ITEMS_PER_PAGE;
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return res.json({ pages: getNumberOfPages() });
    default:
      throwCustomError("Method not allowed", 405);
  }
};

export default apiHandler(handler);
