import { NextApiRequest, NextApiResponse } from "next";
import sql from "@/db";
import throwCustomError from "@/middleware/throwCustomError";
import parseJwt from "@/helpers/parseJwt";
import apiHandler from "@/middleware/api";

const getUserData = async (userId: number) => {
  const [user] = await sql`
    SELECT user_id, email, is_admin
    FROM users
    WHERE user_id=${userId}
  `;

  if (user) {
    return user;
  }

  throwCustomError("The user doesn't exist", 404);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    cookies: { token },
    method,
  } = req;
  const { user_id } = parseJwt(token);

  switch (method) {
    case "GET":
      return res.json({ user: getUserData(user_id) });
    default:
      throwCustomError("Method not allowed", 405);
  }
};

export default apiHandler(handler);
