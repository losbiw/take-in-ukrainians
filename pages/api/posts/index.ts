import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import ITEMS_PER_PAGE from "@/constants/posts";
import throwCustomError from "@/middleware/throwCustomError";
import apiHandler from "@/middleware/api";

export const getPosts = async (
  page: number,
  offersOnly?: boolean | undefined
) => {
  const posts = await sql`
    SELECT * FROM posts
    ${
      typeof offersOnly !== "undefined"
        ? sql`WHERE is_offering=${offersOnly}`
        : sql``
    }
    ORDER BY post_id DESC
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${(page - 1) * ITEMS_PER_PAGE}
  `;

  if (posts.length > 0) {
    return posts;
  }

  throwCustomError("No more posts were found", 404);
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { page, offersOnly },
    method,
  } = req;

  const parseQueryPage = () => {
    if (!page) {
      throwCustomError('Required argument "page" wasn\'t provided', 401);
    }

    const parsedPage = parseInt(page as string, 10);

    if (Number.isNaN(parsedPage)) {
      throwCustomError(
        'Incorrent type of "page" argument. Must be of type "number"',
        401
      );
    }

    return parsedPage;
  };

  switch (method) {
    case "GET":
      return res.json({
        posts: getPosts(parseQueryPage(), offersOnly === "true"),
      });
    default:
      throwCustomError("Method not allowed", 405);
  }
};

export default apiHandler(handler);
