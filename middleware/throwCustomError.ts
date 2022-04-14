import ErrorWithCode from "@/types/error";

const throwCustomError = (message: string, statusCode: number) => {
  throw new ErrorWithCode(message, statusCode);
};

export default throwCustomError;
