import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import parseJwt from "@/helpers/parseJwt";
import sql from "@/db";
import socialMedia from "@/constants/socials";

const getContactInfo = async (userId: number) => {
  const [contacts] = await sql`
    SELECT * FROM contacts
    where user_id=${userId}
  `;

  return contacts;
};

const addContact = (
  socialMediaName: keyof typeof socialMedia,
  value: string
) => {
  const [returned] = sql`
    INSERT 
  `;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    cookies: { token },
    method,
  } = req;
  const { user_id } = parseJwt(token);

  switch (method) {
    case "GET":
      // eslint-disable-next-line no-case-declarations
      const contacts = await getContactInfo(user_id);
      return res.json({ ...contacts });
    case "POST":
      return;
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default handler;
