import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const verify = () => {
    try {
      const { userId, isAdmin } = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET
      ) as JwtPayload;

      return res.status(200).json({
        userId,
        isAdmin,
      });
    } catch {
      res.setHeader(
        "Set-Cookie",
        "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );

      return res.redirect("/");
    }
  };

  switch (req.method) {
    case "GET":
      return verify();
    default:
      return res.status(405);
  }
}
