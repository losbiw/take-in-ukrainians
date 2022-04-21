import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import server from "@/constants/server";

const urlsAllowedWithoutAuth = [
  "/",
  /\/feed\/\d+/,
  "/auth/login",
  "/auth/signup",
  "/auth/recovery",
  "/auth/new-password",
  "/email-sent",
  /\/post\/\d+/,
];

const middleware: NextMiddleware = (req: NextRequest) => {
  const { pathname, searchParams } = req.nextUrl;

  const queryToken = searchParams.get("token") as string;
  const token = req.cookies.token || queryToken;

  if (pathname.startsWith("/api") || pathname.startsWith("/assets")) {
    return NextResponse.next();
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const url of urlsAllowedWithoutAuth) {
    if (typeof url === "string" && url === pathname) return NextResponse.next();

    if (typeof url !== "string" && pathname.match(url))
      return NextResponse.next();
  }

  try {
    const fetchUser = async () => {
      const res = await fetch(
        `${server}/api/user/general${token ? `?token=${token}` : ""}`
      );

      if (res.ok) {
        return NextResponse.next();
      }

      return NextResponse.redirect(`${server}/auth/login`).clearCookie("token");
    };

    return fetchUser();
  } catch {
    return NextResponse.redirect(`${server}/auth/login`).clearCookie("token");
  }
};

export default middleware;
