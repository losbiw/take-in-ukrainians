import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import sql from "@/db";

interface ExtendedApiRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

export default function handler(req: ExtendedApiRequest, res: NextApiResponse) {
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
      return res.status(400).json({
        key: "login:user_doesnt_exist",
        message: "User doesn't exist",
      });
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
          token,
        });
    }

    return res.status(401).json({
      key: "login:incorrent_data",
      message: "Incorrect login or password",
    });
  };

  switch (method) {
    case "POST":
      if (!email) {
        return res.status(400).json({
          message: 'Required argument "email" was not provided',
        });
      }
      if (!plainPassword) {
        return res.status(400).json({
          message: 'Required argument "password" was not provided',
        });
      }

      return authenticate();
    default:
      return res.status(405).end();
  }
}
