import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import parseJwt from "@/helpers/parseJwt";
import sql from "@/db";
import contactMethods from "@/constants/contacts";
import { ContactData } from "@/types/contacts";

const findInvalidKeys = (contacts: ContactData) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(contacts)) {
    if (!contactMethods[key as keyof typeof contactMethods]) {
      return key;
    }
  }

  return null;
};

export const getContactInfo = async (userId: number): Promise<ContactData> => {
  const [contact] = await sql`
    SELECT facebook, instagram, telegram, whatsapp, viber
    FROM users
    WHERE user_id=${userId}
  `;

  if (!contact) {
    throw new ApiError(404, "User was not found");
  }

  const filteredContactTuples = Object.entries(contact).filter(
    (tuple) => !!tuple[1] // tuple[1] contains the value of the object property
  );
  const filteredContact = Object.fromEntries(filteredContactTuples);

  return filteredContact as ContactData;
};

const updateContact = async (userId: number, contactMethod: ContactData) => {
  const [user] = await sql`
    UPDATE users
    SET ${sql(contactMethod)}
    WHERE user_id=${userId}
    RETURNING user_id
  `;

  if (user.user_id) {
    return {
      user_id: userId,
      ...contactMethod,
    };
  }

  throw new ApiError(404, "User was not found");
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    cookies: { token },
    method,
    body: rawBody,
  } = req;

  const { user_id } = parseJwt(token);
  const body = JSON.parse(rawBody);

  if (Object.keys(body).length) {
    const invalidKey = findInvalidKeys(body);

    if (invalidKey) {
      throw new ApiError(
        422,
        `User contact scheme doesn't have the key: ${invalidKey}`
      );
    }
  }

  switch (method) {
    case "GET":
      return res.json(await getContactInfo(user_id));
    case "POST":
      return res.json(await updateContact(user_id, body));
    case "DELETE":
      const contactTuples = Object.entries(body).map(([key]) => [key, null]);

      return res.json(
        await updateContact(user_id, Object.fromEntries(contactTuples))
      );
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default handler;
