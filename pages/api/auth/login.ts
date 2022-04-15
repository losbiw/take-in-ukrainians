import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
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
      throw new ApiError(404, "User was not found");
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

    throw new ApiError(401, "Username or password is incorrect");
  };

  switch (method) {
    case "POST":
      if (!email) {
        throw new ApiError(422, 'Required argument "email" was not provided');
      }

      if (!plainPassword) {
        throw new ApiError(
          422,
          'Required argument "password" was not provided'
        );
      }

      return authenticate();
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
