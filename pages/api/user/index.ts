import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
import parseJwt from "@/helpers/parseJwt";
import apiHandler from "@/middleware/api";
import { deletePost } from "../post/[pid]";

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    method,
    cookies: { token },
  } = req;
  const { user_id } = parseJwt(token);

  const deleteAccount = async () => {
    const [user] = await sql`
      SELECT posts_id
      FROM users
      WHERE user_id=${user_id}
    `;

    if (user?.posts_id) {
      (user.posts_id as number[]).forEach((postId) => {
        deletePost(postId, user_id);
      });
    }

    const [deletedUser] = await sql`
      DELETE FROM users
      WHERE user_id=${user_id}
      RETURNING *
    `;

    if (deletedUser) {
      return true;
    }

    throw new ApiError(500, "Account could not be deleted");
  };

  switch (method) {
    case "DELETE":
      return res
        .setHeader(
          "Set-Cookie",
          "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        )
        .json({
          deleted: await deleteAccount(),
        });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
