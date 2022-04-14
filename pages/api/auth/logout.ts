import { NextApiRequest, NextApiResponse } from "next";
import throwCustomError from "@/middleware/throwCustomError";
import apiHandler from "@/middleware/api";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    cookies: { token },
    method,
  } = req;

  const logout = () => {
    if (token) {
      res
        .setHeader(
          "Set-Cookie",
          "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        )
        .json({
          message: "You were logged out successfully",
        });
    }

    throwCustomError("You are already logged out", 400);
  };

  switch (method) {
    case "GET":
      return logout();
    default:
      throwCustomError("Method not allowed", 405);
  }
};

export default apiHandler(handler);
