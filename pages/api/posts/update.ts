import { NextApiRequest, NextApiResponse } from "next";
import Post from "@/types/post";
import sql from "@/db";

interface ExtendedApiRequest extends NextApiRequest {
  body: Post;
}

export default function handler(req: ExtendedApiRequest, res: NextApiResponse) {
  const updatePost = async (post: Post) => {
    const [existingPost] = await sql`
      SELECT * FROM posts
      where post_id=${post.id}
    `;

    if (existingPost) {
      const { title, city, maxPeople, isOfferring, id } = post;

      const [updatedPost] = await sql`
        UPDATE posts
        SET title=${title}
            city=${city}
            max_people=${maxPeople}
            is_offerring=${isOfferring}
        WHERE id=${id}
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

  switch (req.method) {
    case "PATCH":
      return updatePost(req.body);
    default:
      return res.status(405);
  }
}
