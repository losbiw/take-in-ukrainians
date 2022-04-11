import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import sql from "@/db";
import server from "@/constants/server";

interface ExtendedApiRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const transport = nodemailer.createTransport({
  host: "gmail.com",
  port: 4141,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
        key: "signup:user_already_exists",
        message: "User already exists",
      });
    }

    const encryptedPassword = crypto
      .createHmac("sha256", process.env.SHA256_SECRET)
      .update(plainPassword)
      .digest("hex");

    const [returnedUser] = await sql`
      INSERT INTO 
      users(email, password, is_admin, is_confirmed)
      VALUES(${email}, ${encryptedPassword}, ${false}, ${false})
      RETURNING user_id, is_admin, email
    `;

    const { emai: returnedEmail, user_id, is_admin } = returnedUser;

    if (user_id) {
      const token = jwt.sign({ user_id, is_admin }, process.env.JWT_SECRET, {
        expiresIn: "20m",
      });

      transport.sendMail({
        from: "",
        to: returnedEmail,
        subject: "Confirm your email to publish an offer",
        html: `<a href="${server}/auth/verify_email?token=${token}">Click here to confirm the email</a>`,
      });

      return res.status(200).json({
        message: "Your account has been created successfully",
      });
    }

    return res.status(500).json({
      message: "Your account could not be created. Try again later",
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
