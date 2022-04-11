import jwt, { JwtPayload } from "jsonwebtoken";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import server from "@/constants/server";

const verifyServerJWT = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user_id, is_admin } = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET
    ) as JwtPayload;

    return {
      user_id,
      is_admin,
    };
  } catch {
    res.setHeader(
      "Set-Cookie",
      "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );

    return {};
  }
};

const verifyClientJWT = async (ctx: GetServerSidePropsContext) => {
  const {
    cookies: { token },
  } = ctx.req;

  const redirectProps = {
    redirect: {
      destination: "/auth/login",
      permanent: true,
    },
  };

  if (token) {
    const res = await fetch(`${server}/api/auth/verify`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    const json = await res.json();

    if (json.user_id) {
      return {
        props: {},
      };
    }

    ctx.res.setHeader(
      "Set-Cookie",
      "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    );

    return redirectProps;
  }

  ctx.res.setHeader(
    "Set-Cookie",
    "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );

  return redirectProps;
};

export default {
  server: verifyServerJWT,
  client: verifyClientJWT,
};
