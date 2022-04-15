/* eslint-disable consistent-return */
import { NextApiResponse, NextApiRequest, NextApiHandler } from "next";
import { ApiError } from "next/dist/server/api-utils";
import Post from "@/types/post";
import sql from "@/db";
import parseJwt from "@/helpers/parseJwt";
import apiHandler from "@/middleware/api";

const createPost = async (post: Omit<Post, "post_id">) => {
  const [author] = await sql`
    SELECT email FROM users
    WHERE user_id=${post.user_id}  
  `;

  if (!author) {
    throw new ApiError(404, "The author was not found");
  }

  const [result] = await sql`
    INSERT INTO posts ${sql(post)}
    RETURNING post_id
  `;

  await sql`
    UPDATE users 
    SET posts_id = array_append(posts_id, ${result.post_id as number})
    WHERE user_id=${post.user_id}
    RETURNING user_id, posts_id
  `;

  if (result) {
    return result;
  }

  throw new ApiError(500, "Something went wrong");
};

const updatePost = async (post: Post, userId: number) => {
  const [existingPost] = await sql`
    SELECT user_id FROM posts
    WHERE post_id=${post.post_id}
  `;

  if (existingPost.user_id) {
    if (userId !== existingPost.user_id) {
      throw new ApiError(
        401,
        "User doesn't have the permission to edit the post"
      );
    }

    const [updatedPost] = await sql`
      UPDATE posts
      SET ${sql(post)}
      WHERE post_id=${post.post_id}
      RETURNING *
    `;

    if (updatedPost) {
      return updatedPost;
    }

    throw new ApiError(500, "Something went wrong");
  }

  throw new ApiError(404, "The post was not found");
};

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    cookies: { token },
    body,
    method,
  } = req;
  const { user_id } = parseJwt(token);

  switch (method) {
    case "POST":
      return res.json({
        post: createPost({
          ...body,
          user_id,
        }),
      });
    case "PATCH":
      return res.json({ post: updatePost(body, user_id) });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);