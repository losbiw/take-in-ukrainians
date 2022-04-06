import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { token },
  } = req;

  const verify = () => {
    try {
      jwt.verify(token as string, process.env.JWT_SECRET);

      res.redirect("/dashboard?email_verification=success");
    } catch {
      res.redirect("/dashboard?email_verification=expired");
    }
  };

  switch (method) {
    case "POST":
      if (!token) {
        return res.status(400).json({
          message: 'Required query argument "token" was not provided',
        });
      }

      return verify();
    default:
      return res.status(405).end();
  }
}
