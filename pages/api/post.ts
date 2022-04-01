/* eslint-disable consistent-return */
import { NextApiResponse, NextApiRequest } from "next";
import Post from "@/types/post";
import sql from "@/db";
import verifyJWT from "@/helpers/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId: JWTUserId } = verifyJWT(req, res);
  const { postId } = req.query;

  if (!JWTUserId) return res.redirect("/");

  const getPost = async () => {
    const [post] = await sql`
      SELECT * FROM posts
      WHERE post_id=${postId}
    `;

    if (post) {
      return res.status(200).json({
        status: "success",
        post,
      });
    }

    return res.status(404).json({
      message: "The post doesn't exist",
    });
  };

  const createPost = async (post: Omit<Post, "postId">) => {
    const { title, city, userId, maxPeople, isOfferring } = post;

    if (JWTUserId !== userId) {
      return res.status(401).json({
        message: "You are not allowed to publish from this account",
      });
    }

    const [result] = await sql`
      INSERT INTO
      posts (title, city, author_id, max_people, is_offerring)
      VALUES (${title}, ${city}, ${userId}, ${maxPeople}, ${isOfferring})
    `;

    const [updatedAuthor] = await sql`
      UPDATE users 
      SET post_ids = array_append(post_ids, ${result.postId as number})
      WHERE user_id=${userId}
      RETURNING user_id, post_ids
    `;

    if (result && updatedAuthor) {
      return res.status(200).json({
        status: "success",
        message: "Your post has been submitted successfully",
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
      SELECT * FROM posts
      where post_id=${post.postId}
    `;

    if (existingPost) {
      const { title, city, maxPeople, isOfferring, userId } = post;

      if (JWTUserId !== userId) {
        return res.status(401).json({
          message: "You are not allowed to change the author's post",
        });
      }

      const [updatedPost] = await sql`
        UPDATE posts
        SET title=${title}
            city=${city}
            max_people=${maxPeople}
            is_offerring=${isOfferring}
        WHERE post_id=${post.postId}
      `;

      if (updatedPost) {
        return res.status(200).json({
          status: "success",
          message: "Your publication has been updated successfully",
        });
      }

      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }

    return res.status(404).json({
      status: "error",
      message: "The post doesn't exist",
    });
  };

  const deletePost = async () => {
    const [post] = await sql`
      SELECT author_id FROM posts
      WHERE post_id=${postId}
    `;

    if (JWTUserId !== post.author_id) {
      return res.status(401).json({
        message: "You are not allowed to delete the post",
      });
    }

    const [deletedPost] = await sql`
      DELETE FROM posts
      WHERE post_id=${postId}
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
    if (!postId) {
      return res.status(401).json({
        message: 'Required argument "postId" wasn\'t provided',
      });
    }

    const parsedId = parseInt(postId as string, 10);

    if (Number.isNaN(parsedId)) {
      return res.status(401).json({
        message:
          'Incorrent type of "postId" argument. Must be of type "number"',
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
