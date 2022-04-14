import { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import ErrorWithCode from "@/types/error";
import jwtMiddleware from "./jwt";
import server from "@/constants/server";

const apiHandler =
  (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
    try {
      jwtMiddleware(req);

      handler(req, res);
    } catch (e) {
      const { statusCode, message } = e as ErrorWithCode;

      if (message === "Auth expired") {
        return res
          .setHeader(
            "Set-Cookie",
            "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          )
          .redirect(`${server}/auth/login`);
      }

      return res.status(statusCode).json({
        message,
      });
    }
  };

export default apiHandler;
