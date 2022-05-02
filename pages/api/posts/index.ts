import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
import ITEMS_PER_PAGE from "@/constants/posts";
import apiHandler from "@/middleware/api";
import Post from "@/types/post";
import Filters from "@/types/filters";

export const getPosts = async (
  page: number,
  { peopleNumber, cityId, offersOnly }: Filters
): Promise<Post[]> => {
  const isOffersOnlyUndefined = typeof offersOnly === "undefined";
  const isCityUndefined = typeof cityId === "undefined";
  const isPeopleNumberUndefined = typeof peopleNumber === "undefined";

  const posts = await sql`
    SELECT * FROM posts
    WHERE 1=1
      AND (true=${isOffersOnlyUndefined} OR is_offering=${
    offersOnly as boolean
  })
    AND (true=${isCityUndefined} OR city_id=${cityId || "1"})
    AND (true=${
      !isPeopleNumberUndefined && !(offersOnly as boolean)
    } OR people_number >= ${peopleNumber || 0})
    AND (true=${
      !isPeopleNumberUndefined && (offersOnly as boolean)
    } OR people_number <= ${peopleNumber || 0})
    ORDER BY post_id DESC
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${(page - 1) * ITEMS_PER_PAGE}
  `;

  if (posts.length > 0) {
    return posts as unknown as Post[];
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
        posts: await getPosts(parseQueryPage(), {
          offersOnly: offersOnly ? offersOnly === "true" : undefined,
        }),
      });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
