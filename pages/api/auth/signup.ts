import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
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
      SELECT * FROM users
      WHERE email=${email}
    `;

    if (user) {
      return res.status(400).json({
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
        message: "Your account has been created successfully",
      });
    }

    return res.status(500).json({
      message: "Something went wrong. Please try again later",
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
