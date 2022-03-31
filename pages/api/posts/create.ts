import { NextApiRequest, NextApiResponse } from "next";
import Post from "@/types/post";
import sql from "@/db";

interface ExtendedApiRequest extends NextApiRequest {
  body: Post;
}

export default function handler(req: ExtendedApiRequest, res: NextApiResponse) {
  const createPost = async (post: Omit<Post, "id">) => {
    const { title, city, authorId, maxPeople, isOfferring } = post;

    const [result] = await sql`
      INSERT INTO
      posts (title, city, author_id, max_people, is_offerring)
      VALUES (${title}, ${city}, ${authorId}, ${maxPeople}, ${isOfferring})
    `;

    if (result) {
      return res.status(200).json({
        status: "success",
        message: "Your post has been submitted successfully",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Something went wrong, try again later",
    });
  };

  switch (req.method) {
    case "POST":
      return createPost(req.body);
    default:
      return res.status(405);
  }
}
