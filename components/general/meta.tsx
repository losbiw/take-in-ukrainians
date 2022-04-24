import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import React, { FC } from "react";

interface Props {
  title: string;
  description?: string;
}

const MetaTags: FC<Props> = ({ children, title, description }) => {
  const { t } = useTranslation("general");

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description || t("description")} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description || t("description")} />
        <meta name="og:image" content="https://take-in-ukrainians.com/og.png" />
      </Head>

      {children}
    </>
  );
};

export default MetaTags;
