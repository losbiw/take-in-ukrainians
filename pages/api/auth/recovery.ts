import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import apiHandler from "@/middleware/api";
import sql from "@/db";
import server from "@/constants/server";

const transport = nodemailer.createTransport({
  host: "take-in-ukrainians.com",
  port: 465,
  auth: {
    user: process.env.RECOVERY_EMAIL_USERNAME,
    pass: process.env.RECOVERY_EMAIL_PASSWORD,
  },
});

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    method,
    body: { email },
  } = req;

  const recover = async () => {
    const [user] = await sql`
      SELECT user_id
      FROM USERS 
      WHERE email=${email as string}
    `;

    if (!user?.user_id) {
      throw new ApiError(404, "User was not found");
    }

    const token = jwt.sign(
      { user_id: user.user_id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      {
        expiresIn: "20m",
      }
    );

    transport.sendMail({
      from: '"Password Recovery" <recovery@take-in-ukrainians.com>',
      to: email,
      subject: "Recover your forgotten password",
      html: `<a href="${server}/auth/new-password?token=${token}">Click here to recover the password</a>`,
    });

    return "Recovery link was sent successfully";
  };

  switch (method) {
    case "POST": {
      if (!email) {
        throw new ApiError(422, 'Required argument "email" was not provided');
      }

      return res.json({ message: await recover() });
    }
    default: {
      throw new ApiError(405, "Method not allowed");
    }
  }
};

export default apiHandler(handler);
