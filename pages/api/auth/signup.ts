import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ApiError } from "next/dist/server/api-utils";
import nodemailer from "nodemailer";
import getT from "next-translate/getT";
import sql from "@/db";
import server from "@/constants/server";
import apiHandler from "@/middleware/api";
import validateInputs from "@/helpers/validateInputs";
import generateEmailTemplate from "@/helpers/sendEmail";

const transport = nodemailer.createTransport({
  host: "take-in-ukrainians.com",
  port: 465,
  auth: {
    user: process.env.CONFIRMATION_EMAIL_USERNAME,
    pass: process.env.CONFIRMATION_EMAIL_PASSWORD,
  },
});

interface ExtendedApiRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
    locale: string;
  };
}

const handler: NextApiHandler = async (
  req: ExtendedApiRequest,
  res: NextApiResponse
) => {
  const {
    method,
    body: { email, password, locale },
  } = req;

  const t = await getT(locale, "email");

  const authenticate = async () => {
    const [user] = await sql`
      SELECT user_id FROM users
      WHERE email=${email}
    `;

    if (user?.user_id) {
      throw new ApiError(409, "User already exists");
    }

    const hashedPassword = crypto
      .createHmac("sha256", process.env.SHA256_SECRET)
      .update(password)
      .digest("hex");

    const [returnedUser] = await sql`
      INSERT INTO 
      users(email, password, is_admin, is_confirmed)
      VALUES(${email}, ${hashedPassword}, ${false}, ${false})
      RETURNING user_id, is_admin, email
    `;

    const { email: returnedEmail, user_id, is_admin } = returnedUser;

    if (user_id) {
      const token = jwt.sign({ user_id, is_admin }, process.env.JWT_SECRET, {
        expiresIn: "20m",
      });

      transport.sendMail({
        from: '"Email Confirmation" <confirmation@take-in-ukrainians.com>',
        to: returnedEmail,
        subject: "Confirm your email to access full functionality",
        html: generateEmailTemplate(
          t("confirm your email"),
          t("it is required to access"),
          {
            href: `${server}/auth/confirm-email?token=${token}`,
            text: t("confirm email"),
          }
        ),
      });

      return "We have sent you the email confirmation email.";
    }

    throw new ApiError(500, "Your account could not be created");
  };

  switch (method) {
    case "POST":
      const [areErrorsPresent, errors] = validateInputs.auth({
        email,
        password,
        passwordConfirmation: password,
        formType: "signup",
        includePassword: true,
      });

      if (areErrorsPresent) {
        return res.status(422).json({
          errors,
        });
      }

      return res.json({
        message: await authenticate(),
      });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
