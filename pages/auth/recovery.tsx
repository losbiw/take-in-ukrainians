import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import AuthForm from "@/components/auth-form/auth-form";
import SplitScreen from "@/components/auth-form/split-screen";

const PasswordRecovery: NextPage = () => {
  const { t } = useTranslation("recovery");

  return (
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
  );
};

export default PasswordRecovery;
