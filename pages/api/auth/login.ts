import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ApiError } from "next/dist/server/api-utils";
import sql from "@/db";
import apiHandler from "@/middleware/api";
import { sendConfirmationEmail } from "./signup";
import validateInputs from "@/helpers/validateInputs";

interface ExtendedApiRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const handler = (req: ExtendedApiRequest, res: NextApiResponse) => {
  const {
    method,
    body: { email, password },
  } = req;

  const authenticate = async () => {
    const [user] = await sql`
      SELECT password, user_id, is_admin, is_confirmed FROM users
      WHERE email=${email}
    `;

    if (!user) {
      throw new ApiError(404, "User was not found");
    }

    const hashedPassword = crypto
      .createHmac("sha256", process.env.SHA256_SECRET)
      .update(password)
      .digest("hex");

    if (hashedPassword === user.password) {
      const { user_id, is_admin, is_confirmed } = user;

      if (!is_confirmed) {
        sendConfirmationEmail(email, {
          user_id,
          is_admin,
        });

        throw new ApiError(
          403,
          "Your email has not been confirmed. We have just re-sent the confirmation email."
        );
      }

      const token = jwt.sign({ user_id, is_admin }, process.env.JWT_SECRET);

      return res
        .status(200)
        .setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 3600 * 24 * 7 * 14,
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
      const [areErrorsPresent, errors] = validateInputs.auth({
        email,
        password,
        passwordConfirmation: "",
        formType: "login",
      });

      if (areErrorsPresent) {
        return res.status(422).json({
          errors,
        });
      }

      return authenticate();
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
