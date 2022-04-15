import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
import ITEMS_PER_PAGE from "@/constants/posts";
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

  throw new ApiError(404, "Posts were not found");
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { page, offersOnly },
    method,
  } = req;

  const parseQueryPage = () => {
    if (!page) {
      throw new ApiError(422, 'Required argument "page" was not provided');
    }

    const parsedPage = parseInt(page as string, 10);

    if (Number.isNaN(parsedPage)) {
      throw new ApiError(
        422,
        'Incorrent type of "page" argument. Must be of type "number"'
      );
    }

    return parsedPage;
  };

  switch (method) {
    case "GET":
      return res.json({
        posts: await getPosts(
          parseQueryPage(),
          offersOnly ? offersOnly === "true" : undefined
        ),
      });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
