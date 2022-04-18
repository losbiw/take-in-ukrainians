import { NextApiResponse, NextApiRequest, NextApiHandler } from "next";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
import parseJwt from "@/helpers/parseJwt";
import apiHandler from "@/middleware/api";

export const getPost = async (postId: number) => {
  const [post] = await sql`
    SELECT * FROM posts
    WHERE post_id=${postId}
  `;

  if (post) {
    return post;
  }

  throw new ApiError(404, "The post was not found");
};

const deletePost = async (postId: number, userId: number) => {
  const [post] = await sql`
    SELECT user_id FROM posts
    WHERE post_id=${postId}
  `;

  if (userId !== post.user_id) {
    throw new ApiError(
      403,
      "User doesn't have the permission to delete the post"
    );
  }

  const [deletedPost] = await sql`
    DELETE FROM posts
    WHERE post_id=${postId}
    RETURNING *
  `;

  if (deletedPost) {
    const [user] = await sql`
      SELECT posts_id
      FROM users
      WHERE user_id=${userId}
    `;

    const posts = user.posts_id as number[];
    posts.splice(posts.indexOf(postId), 1);

    await sql`
      UPDATE users
      SET posts_id=${posts}
      WHERE user_id=${userId}
    `;

    return "The post was deleted successfully";
  }

  throw new ApiError(404, "The post was not found");
};

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    query: { pid },
    cookies: { token },
    method,
  } = req;

  const { user_id } = parseJwt(token);

  const parseQueryId = () => {
    const parsedId = parseInt(pid as string, 10);

    if (Number.isNaN(parsedId)) {
      throw new ApiError(
        422,
        'Incorrent type of "post_id" argument. Must be of type "number"'
      );
    }

    return parsedId;
  };

  switch (method) {
    case "GET":
      return res.json({ post: await getPost(parseQueryId()) });
    case "DELETE":
      return res.json({ message: await deletePost(parseQueryId(), user_id) });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
