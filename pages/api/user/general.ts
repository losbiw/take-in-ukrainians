import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
import parseJwt from "@/helpers/parseJwt";
import apiHandler from "@/middleware/api";
import User from "@/types/user";

type GeneralUserData = Pick<User, "user_id" | "email" | "is_admin">;

const getUserData = async (userId: number): Promise<GeneralUserData> => {
  const [user] = await sql`
    SELECT user_id, email, is_admin
    FROM users
    WHERE user_id=${userId}
  `;

  if (user) {
    return user as GeneralUserData;
  }

  throw new ApiError(404, "The user was not found");
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    cookies: { token },
    query: { token: queryToken },
    method,
  } = req;
  const { user_id } = parseJwt(token || (queryToken as string));

  switch (method) {
    case "GET":
      return res.json({ user: await getUserData(user_id) });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
