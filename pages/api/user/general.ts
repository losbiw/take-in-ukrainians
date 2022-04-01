import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import validateJWT from "@/helpers/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId: JWTUserId } = await validateJWT();

  const getUser = async (userId: number) => {
    const [user] = await sql`
      SELECT user_id, email, is_admin
      FROM users
      WHERE user_id=${userId}
    `;

    if (user) {
      return res.status(200).json({
        status: "success",
        user,
      });
    }

    return res.status(404).json({
      message: "The user doesn't exist",
    });
  };

  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({
        message: 'Required argument "userId" wasn\'t provided',
      });
    }

    const parsedId = parseInt(userId as string, 10);

    if (JWTUserId !== parsedId) {
      return res.status(401).json({
        message: "You don't have access to this data",
      });
    }

    if (Number.isNaN(parsedId)) {
      return res.status(401).json({
        message:
          'Incorrent type of "userId" argument. Must be of type "number"',
      });
    }

    return getUser(parsedId);
  }

  return res.status(405).end();
}
