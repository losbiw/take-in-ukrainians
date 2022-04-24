import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import Head from "next/head";
import AuthForm from "@/components/auth-form/auth-form";
import SplitScreen from "@/components/auth-form/split-screen";

const PasswordRecovery: NextPage = () => {
  const { t } = useTranslation("recovery");

  return (
    <>
      <Head>
        <title>{t("password recovery")} | Take in Ukrainians</title>
      </Head>
      <SplitScreen>
        <AuthForm
          formType="recovery"
          title={t("password recovery")}
          description={t("email the recovery link")}
          fields={[
            {
              type: "email",
              placeholder: t("enter your recovery email"),
              key: "email",
            },
          ]}
        />
      </SplitScreen>
    </>
  );
};

export default PasswordRecovery;
