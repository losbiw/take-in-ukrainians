import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import apiHandler from "@/middleware/api";
import parseJwt from "@/helpers/parseJwt";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    cookies: { token },
    method,
  } = req;

  switch (method) {
    case "GET":
      return res.json({ ...parseJwt(token) });
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default apiHandler(handler);
