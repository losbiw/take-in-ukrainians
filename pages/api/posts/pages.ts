import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
import ITEMS_PER_PAGE from "@/constants/posts";
import apiHandler from "@/middleware/api";

export const getPagesTotal = async () => {
  const posts = await sql`
    SELECT post_id
    FROM posts
  `;

  return Math.ceil(posts.length / ITEMS_PER_PAGE);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return res.json({ pagesTotal: await getPagesTotal() });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
