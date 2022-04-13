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
    return getUser(JWTUserId);
  }

  return res.status(405).end();
}
