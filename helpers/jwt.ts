import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const verifyJWT = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { userId, isAdmin } = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET
    ) as JwtPayload;

    return {
      userId,
      isAdmin,
    };
  } catch {
    res.setHeader(
      "Set-Cookie",
      "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );

    return {};
  }
};

export default verifyJWT;
