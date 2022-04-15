import { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import { ApiError } from "next/dist/server/api-utils";
import errorHandler from "./errorHandler";
import jwtMiddleware from "./jwt";

const apiHandler =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      jwtMiddleware(req);

      await handler(req, res);
    } catch (e) {
      errorHandler(e as ApiError, res);
    }
  };

export default apiHandler;
