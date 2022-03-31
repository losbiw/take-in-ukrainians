import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
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
      SELECT * FROM users
      WHERE email=${email}
    `;

    if (user) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    const encryptedPassword = crypto
      .createHmac("sha256", process.env.SHA256_SECRET)
      .update(plainPassword)
      .digest("hex");

    const users = await sql`
      INSERT INTO 
      users(email, password)
      VALUES(${email}, ${encryptedPassword})
      RETURNING email, password
    `;

    if (users.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "Your account has been created successfully",
      });
    }

    return res.status(500).json({
      status: "success",
      message: "Something went wrong. Please try again later",
    });
  };

  switch (method) {
    case "POST":
      return authenticate();
    default:
      return res.status(405);
  }
}
