import { NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

const errorHandler = async (e: ApiError, res: NextApiResponse) => {
  const { statusCode, message } = e;

  if (message === "Authentication failed") {
    return res
      .setHeader(
        "Set-Cookie",
        "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      )
      .status(statusCode)
      .json({ message });
  }

  return res.status(statusCode).json({
    message,
  });
};

export default errorHandler;
