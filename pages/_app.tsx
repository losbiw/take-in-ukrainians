import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { useRouter } from "next/router";

const urlsWithoutAuth = [
  "/",
  /\/feed\/\d+/,
  "/auth/login",
  "/auth/signup",
  /\/post\/\d+/,
];

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const router = useRouter();

  useEffect(() => {
    const { asPath } = router;

    // eslint-disable-next-line no-restricted-syntax
    for (const url of urlsWithoutAuth) {
      if (typeof url === "string" && url === asPath) return;

      if (typeof url !== "string" && asPath.match(url)) return;
    }

    router.replace("/auth/login");
  }, []);

  return <Component {...pageProps} />;
};

export default App;
