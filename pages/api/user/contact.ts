import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";
import parseJwt from "@/helpers/parseJwt";
import sql from "@/db";
import socialMedia from "@/constants/socials";

export const getContactInfo = async (userId: number) => {
  const [contact] = await sql`
    SELECT facebook, instagram, telegram, whatsapp, viber
    FROM users
    WHERE user_id=${userId}
  `;

  if (!contact) {
    throw new ApiError(404, "User was not found");
  }

  return contact;
};

const updateContact = async (
  userId: number,
  socialMediaRecord: Record<keyof typeof socialMedia, string>
) => {
  const [user] = await sql`
    UPDATE users
    SET ${sql(socialMediaRecord)}
    WHERE user_id=${userId}
    RETURNING user_id
  `;

  if (user.user_id) {
    return {
      user_id: user.user_id,
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

  switch (method) {
    case "GET":
      return res.json(await getContactInfo(user_id));
    case "POST":
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(body)) {
        if (!socialMedia[key as keyof typeof socialMedia]) {
          throw new ApiError(
            422,
            `User contact scheme doesn't have the key: ${key}`
          );
        }
      }

      return res.json(await updateContact(user_id, body));
    case "DELETE":
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(body)) {
        if (!socialMedia[key as keyof typeof socialMedia]) {
          throw new ApiError(
            422,
            `User contact scheme doesn't have the key: ${key}`
          );
        }

        body[key] = null;
      }

      return res.json(await updateContact(user_id, body));
    default:
      throw new ApiError(405, "Method not allowed");
  }
};

export default handler;
