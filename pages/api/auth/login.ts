import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import sql from "@/db";

interface ExtendedApiRequest extends NextApiRequest {
  body: {
    email: string;
    plainPassword: string;
  };
}

export default function handler(req: ExtendedApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  const authenticate = async () => {
    const { email, plainPassword } = body;

    const [user] = await sql`
      SELECT password FROM users
      WHERE email=${email}
    `;

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User doesn't exist",
      });
    }

    const encryptedPassword = crypto
      .createHmac("sha256", process.env.SHA256_SECRET)
      .update(plainPassword)
      .digest("hex");

    if (encryptedPassword === user.password) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

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
          status: "success",
          token,
        });
    }

    return res.status(401).json({
      status: "error",
      error: "Incorrect login or username",
    });
  };

  switch (method) {
    case "POST":
      return authenticate();
    default:
      return res.status(405);
  }
}
