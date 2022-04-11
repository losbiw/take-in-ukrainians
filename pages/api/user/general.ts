import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import verifyJWT from "@/helpers/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user_id: JWTUserId } = verifyJWT.server(req, res);

  if (!JWTUserId) return res.redirect("/");

  const getUser = async (userId: number) => {
    const [user] = await sql`
      SELECT user_id, email, is_admin
      FROM users
      WHERE user_id=${userId}
    `;

    if (user) {
      return res.status(200).json({
        user,
      });
    }

    return res.status(404).json({
      message: "The user doesn't exist",
    });
  };

  if (req.method === "GET") {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(401).json({
        message: 'Required argument "user_id" wasn\'t provided',
      });
    }

    const parsedId = parseInt(user_id as string, 10);

    if (Number.isNaN(parsedId)) {
      return res.status(401).json({
        message:
          'Incorrent type of "user_id" argument. Must be of type "number"',
      });
    }

    if (JWTUserId !== parsedId) {
      return res.status(401).json({
        message: "You don't have access to this data",
      });
    }

    return getUser(parsedId);
  }

  return res.status(405).end();
}
