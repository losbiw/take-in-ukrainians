import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import sql from "@/db";
import throwCustomError from "@/middleware/throwCustomError";
import apiHandler from "@/middleware/api";

interface ExtendedApiRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const handler = (req: ExtendedApiRequest, res: NextApiResponse) => {
  const {
    method,
    body: { email, password: plainPassword },
  } = req;

  const authenticate = async () => {
    const [user] = await sql`
      SELECT password, user_id, is_admin FROM users
      WHERE email=${email}
    `;

    if (!user) {
      throwCustomError("user_doesnt_exist", 400);
    }

    const encryptedPassword = crypto
      .createHmac("sha256", process.env.SHA256_SECRET)
      .update(plainPassword)
      .digest("hex");

    if (encryptedPassword === user.password) {
      const { user_id, is_admin } = user;

      const token = jwt.sign({ user_id, is_admin }, process.env.JWT_SECRET);

      return res
        .status(200)
        .setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 3600 * 24 * 7 * 30,
            sameSite: "strict",
            path: "/",
          })
        )
        .json({
          user_id,
          is_admin,
        });
    }

    throwCustomError("incorrect_data", 401);
  };

  switch (method) {
    case "POST":
      if (!email) {
        throwCustomError('Required argument "email" was not provided', 400);
      }

      if (!plainPassword) {
        throwCustomError('Required argument "password" was not provided', 400);
      }

      return authenticate();
    default:
      throwCustomError("Method not allowed", 405);
  }
};

export default apiHandler(handler);
