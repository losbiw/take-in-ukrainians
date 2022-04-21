import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import server from "@/constants/server";

const urlsWithoutAuth = [
  "/",
  /\/feed\/\d+/,
  "/auth/login",
  "/auth/signup",
  "/auth/recovery", // TODO: remove
  "/auth/new-password",
  "/confirmation-letter",
  /\/post\/\d+/,
];

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const router = useRouter();

  useEffect(() => {
    const checkVerification = async () => {
      const { asPath } = router;

      // eslint-disable-next-line no-restricted-syntax
      for (const url of urlsWithoutAuth) {
        if (typeof url === "string" && url === asPath) return;

        if (typeof url !== "string" && asPath.match(url)) return;
      }

      const res = await fetch(`${server}/api/auth/verify`);
      const json = await res.json();

      if (!json.token) {
        router.replace("/auth/login");
      }
    };

    checkVerification();
  }, []);

  return <Component {...pageProps} />;
};

export default App;
