import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
import apiHandler from "@/middleware/api";
import parseJwt from "@/helpers/parseJwt";

export const confirmEmail = async (token: string) => {
  const { user_id } = parseJwt(token);

  const [confirmedUser] = await sql`
      UPDATE users
      SET is_confirmed=true
      WHERE user_id=${user_id as number}
      RETURNING user_id
    `;

  if (!confirmedUser?.user_id) {
    throw new ApiError(500, "Failed to confirm the email");
  }

  return "The email was confirmed successfully";
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { token },
  } = req;

  switch (method) {
    case "POST":
      return res.json({
        message: await confirmEmail(token as string),
      });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
