/* eslint-disable consistent-return */
import { NextApiResponse, NextApiRequest, NextApiHandler } from "next";
import Post from "@/types/post";
import sql from "@/db";
import throwCustomError from "@/middleware/throwCustomError";
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

  throwCustomError("The post doesn't exist", 404);
};

const createPost = async (post: Omit<Post, "post_id">) => {
  const [author] = await sql`
    SELECT email FROM users
    WHERE user_id=${post.user_id}  
  `;

  if (!author) {
    throwCustomError("The author doesn't exist", 404);
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

  throwCustomError("Something went wrong", 500);
};

const updatePost = async (post: Post, userId: number) => {
  const [existingPost] = await sql`
    SELECT user_id FROM posts
    WHERE post_id=${post.post_id}
  `;

  if (existingPost.user_id) {
    if (userId !== existingPost.user_id) {
      throwCustomError("You do not have the permission to edit the post", 401);
    }

    const [updatedPost] = await sql`
      UPDATE posts
      SET ${sql(post)}
      WHERE post_id=${post.post_id}
    `;

    if (updatedPost) {
      return updatedPost;
    }

    throwCustomError("Something went wrong", 500);
  }

  throwCustomError("The post doesn't exist", 404);
};

const deletePost = async (postId: number, userId: number) => {
  const [post] = await sql`
    SELECT user_id FROM posts
    WHERE post_id=${postId}
  `;

  if (userId !== post.user_id) {
    throwCustomError("You don't have the permission to delete the post", 401);
  }

  const [deletedPost] = await sql`
    DELETE FROM posts
    WHERE post_id=${postId}
    RETURNING *
  `;

  if (deletedPost) {
    return "The post was deleted successfully";
  }

  throwCustomError("The post doesn't exist", 404);
};

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    query: { postId },
    cookies: { token },
    body,
    method,
  } = req;
  const { user_id } = parseJwt(token);

  const parseQueryId = () => {
    if (!postId) {
      throwCustomError('Required argument "post_id" wasn\'t provided', 401);
    }

    const parsedId = parseInt(postId as string, 10);

    if (Number.isNaN(parsedId)) {
      throwCustomError(
        'Incorrent type of "post_id" argument. Must be of type "number"',
        401
      );
    }

    return parsedId;
  };

  switch (method) {
    case "GET":
      return res.json({ post: getPost(parseQueryId()) });
    case "POST":
      return res.json({
        post: createPost({
          ...body,
          user_id,
        }),
      });
    case "PATCH":
      return res.json({ post: updatePost(body, user_id) });
    case "DELETE":
      return res.json({ message: deletePost(parseQueryId(), user_id) });
    default:
      throwCustomError("Method not allowed", 405);
  }
};

export default apiHandler(handler);
