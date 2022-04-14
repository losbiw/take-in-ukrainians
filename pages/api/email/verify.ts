import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import throwCustomError from "@/middleware/throwCustomError";
import sql from "@/db";
import apiHandler from "@/middleware/api";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { token },
  } = req;

  const verify = async () => {
    try {
      const { user_id } = jwt.verify(
        token as string,
        process.env.JWT_SECRET
      ) as JwtPayload;

      await sql`
        UPDATE users
        SET is_confirmed=true
        WHERE user_id=${user_id as number}
      `;

      res.redirect("/dashboard?email_verification=success");
    } catch {
      res.redirect("/dashboard?email_verification=failure");
    }
  };

  switch (method) {
    case "POST":
      if (!token) {
        throwCustomError(`Required argument "token" was not provided`, 400);
      }

      return verify();
    default:
      throwCustomError("Method not allowed", 405);
  }
};

export default apiHandler(handler);
