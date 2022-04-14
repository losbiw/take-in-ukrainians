import User from "@/types/user";

const parseJwt = (token: string) => {
  const buffer = Buffer.from(token.split(".")[1], "base64");
  const json = JSON.parse(buffer.toString());

  return json as User;
};

export default parseJwt;
