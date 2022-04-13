/* eslint-disable consistent-return */
import { NextApiResponse, NextApiRequest } from "next";
import Post from "@/types/post";
import sql from "@/db";
import verifyJWT from "@/helpers/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user_id: JWTUserId } = verifyJWT.server(req, res);
  const { post_id } = req.query;

  const getPost = async () => {
    const [post] = await sql`
      SELECT * FROM posts
      WHERE post_id=${post_id}
    `;

    if (post) {
      return res.status(200).json({
        post,
      });
    }

    return res.status(404).json({
      message: "The post doesn't exist",
    });
  };

  const createPost = async (post: Omit<Post, "post_id">) => {
    const {
      title,
      description,
      city_name,
      city_id,
      people_number,
      is_offering,
    } = post;

    const [result] = await sql`
      INSERT INTO
      posts (user_id, title, description, city_name, city_id, people_number, is_offering)
      VALUES (${
        JWTUserId as string
      }, ${title}, ${description}, ${city_name}, ${city_id}, ${people_number}, ${is_offering})
      RETURNING post_id
    `;

    const [updatedAuthor] = await sql`
      UPDATE users 
      SET posts_id = array_append(posts_id, ${result.post_id as number})
      WHERE user_id=${JWTUserId as string}
      RETURNING user_id, posts_id
    `;

    if (result && updatedAuthor) {
      return res.status(200).json({
        post_id: result.post_id,
      });
    }

    if (result) {
      return res.status(404).json({
        message: "The author doesn't exist",
      });
    }

    return res.status(500).json({
      message: "Something went wrong, try again later",
    });
  };

  const updatePost = async (post: Post) => {
    const [existingPost] = await sql`
      SELECT user_id FROM posts
      WHERE post_id=${post.post_id}
    `;

    if (existingPost.user_id) {
      const { title, city_name, description, city_id, people_number } = post;

      if (JWTUserId !== existingPost.user_id) {
        return res.status(401).json({
          message: "You do not have the permission to change the post",
        });
      }

      const [updatedPost] = await sql`
        UPDATE posts
        SET title=${title}
            description=${description}
            city_id=${city_id}
            city_name=${city_name}
            people_number=${people_number}
        WHERE post_id=${post.post_id}
      `;

      if (updatedPost) {
        return res.status(200).json({
          message: "Your publication has been updated successfully",
        });
      }

      return res.status(500).json({
        message: "Something went wrong",
      });
    }

    return res.status(404).json({
      message: "The post doesn't exist",
    });
  };

  const deletePost = async () => {
    const [post] = await sql`
      SELECT user_id FROM posts
      WHERE post_id=${post_id}
    `;

    if (JWTUserId !== post.user_id) {
      return res.status(401).json({
        message: "You are not allowed to delete the post",
      });
    }

    const [deletedPost] = await sql`
      DELETE FROM posts
      WHERE post_id=${post_id}
      RETURNING *
    `;

    if (deletedPost) {
      return res.status(200).json({
        message: "The post was deleted successfully",
      });
    }

    return res.status(404).json({
      message: "The post doesn't exist",
    });
  };

  const validateQueryId = () => {
    if (!post_id) {
      return res.status(401).json({
        message: 'Required argument "post_id" wasn\'t provided',
      });
    }

    const parsedId = parseInt(post_id as string, 10);

    if (Number.isNaN(parsedId)) {
      return res.status(401).json({
        message:
          'Incorrent type of "post_id" argument. Must be of type "number"',
      });
    }
  };

  switch (req.method) {
    case "GET":
      validateQueryId();
      return getPost();
    case "POST":
      return createPost(req.body);
    case "PATCH":
      return updatePost(req.body);
    case "DELETE":
      validateQueryId();
      return deletePost();
    default:
      return res.status(405).end();
  }
}
