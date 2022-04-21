import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import crypto from "crypto";
import sql from "@/db";
import parseJwt from "@/helpers/parseJwt";
import apiHandler from "@/middleware/api";

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    method,
    body: { password },
    query: { token },
  } = req;

  const setNewPassword = async () => {
    const { user_id } = parseJwt(token as string);

    const [user] = await sql`
      SELECT password
      FROM users
      WHERE user_id=${user_id}
    `;

    if (!user?.password) {
      throw new ApiError(404, "User was not found");
    }

    const hashedPassword = crypto
      .createHmac("sha256", process.env.SHA256_SECRET)
      .update(password)
      .digest("hex");

    if (hashedPassword === user.password) {
      throw new ApiError(401, "New password can't be same as the old one");
    }

    const [updatedUser] = await sql`
      UPDATE users
      SET password=${hashedPassword}
      WHERE user_id=${user_id}
      RETURNING user_id
    `;

    return updatedUser.user_id;
  };

  switch (method) {
    case "POST":
      if (!password)
        throw new ApiError(
          422,
          'Required argument "password" was not provided'
        );

      return res.json({
        user_id: await setNewPassword(),
      });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
