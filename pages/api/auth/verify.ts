import { NextApiRequest, NextApiResponse } from "next";
import throwCustomError from "@/middleware/throwCustomError";
import apiHandler from "@/middleware/api";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    cookies: { token },
    method,
  } = req;

  switch (method) {
    case "GET":
      return res.json({ token });
    default:
      throwCustomError("Method not allowed", 405);
  }
};

export default apiHandler(handler);
