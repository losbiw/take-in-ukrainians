import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
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

    throw new ApiError(400, "User is already logged out");
  };

  switch (method) {
    case "GET":
      return logout();
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
