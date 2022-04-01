import { NextApiRequest, NextApiResponse } from "next";
import verifyJWT from "@/helpers/jwt";

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return verifyJWT(req, res);
    default:
      return res.status(405);
  }
}
