import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
import server from "@/constants/server";
import apiHandler from "@/middleware/api";

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

const handler = (req: ExtendedApiRequest, res: NextApiResponse) => {
  const {
    method,
    body: { email, password: plainPassword },
  } = req;

  const authenticate = async () => {
    const [user] = await sql`
      SELECT user_id FROM users
      WHERE email=${email}
    `;

    if (user.user_id) {
      throw new ApiError(409, "User already exists");
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

    const { email: returnedEmail, user_id, is_admin } = returnedUser;

    if (user_id) {
      const token = jwt.sign({ user_id, is_admin }, process.env.JWT_SECRET, {
        expiresIn: "20m",
      });

      transport.sendMail({
        from: "Take in Ukrainians",
        to: returnedEmail,
        subject: "Confirm your email to access full functionality",
        html: `<a href="${server}/auth/confirm-email?token=${token}">Click here to confirm your email</a>`,
      });

      return res.json({
        message: "Your account has been created successfully",
      });
    }

    throw new ApiError(500, "Your account could not be created");
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
