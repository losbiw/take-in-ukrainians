/* eslint-disable consistent-return */
import { NextApiResponse, NextApiRequest, NextApiHandler } from "next";
import { ApiError } from "next/dist/server/api-utils";
import Post from "@/types/post";
import sql from "@/db";
import parseJwt from "@/helpers/parseJwt";
import apiHandler from "@/middleware/api";
import { getContactInfo } from "../user/contact";
import validateInputs from "@/helpers/validateInputs";
import { ContactData, ContactMethod } from "@/types/contacts";

const isContactInfoEmpty = async (contactInfo: ContactData) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(contactInfo)) {
    if (contactInfo[key as ContactMethod]) return false;
  }

  return true;
};

const createPost = async (post: Omit<Post, "post_id">) => {
  const [author] = await sql`
    SELECT email FROM users
    WHERE user_id=${post.user_id}  
  `;

  if (!author) {
    throw new ApiError(404, "The author was not found");
  }

  const contactInfo = await getContactInfo(post.user_id);

  if (await isContactInfoEmpty(contactInfo))
    throw new ApiError(
      401,
      "You must have set at least one way of contacting you before publishing"
    );

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
    return result.post_id as number;
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
        403,
        "User doesn't have the permission to edit the post"
      );
    }

    const [updatedPost] = await sql`
      UPDATE posts
      SET ${sql(post)}
      WHERE post_id=${post.post_id}
      RETURNING post_id
    `;

    if (updatedPost) {
      return updatedPost.post_id as number;
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

  const [areErrorsPresent, errors] = validateInputs.post(body);

  if (areErrorsPresent) {
    return res.status(422).json({
      errors,
    });
  }

  switch (method) {
    case "POST":
      return res.json({
        postId: await createPost({
          ...body,
          user_id,
        }),
      });
    case "PATCH":
      return res.json({ postId: await updatePost(body, user_id) });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
