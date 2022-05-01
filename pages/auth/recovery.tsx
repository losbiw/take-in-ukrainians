import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import AuthForm from "@/components/auth-form/form";
import SplitContainer from "@/components/auth-form/split-screen";
import MetaTags from "@/components/general/meta";

const PasswordRecovery: NextPage = () => {
  const { t } = useTranslation("recovery");

  return (
    <>
      <MetaTags title={`${t("password recovery")} | Take in Ukrainians`} />

      <SplitContainer>
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
      </SplitContainer>
    </>
  );
};

export default PasswordRecovery;
