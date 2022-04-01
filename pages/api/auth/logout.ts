import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const logout = () => {
    if (req.cookies.token) {
      res.setHeader(
        "Set-Cookie",
        "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );

      res.redirect("/");
    }

    return res.status(400).json({
      message: "You are already logged out",
    });
  };

  switch (req.method) {
    case "GET":
      return logout();
    default:
      return res.status(405);
  }
}
