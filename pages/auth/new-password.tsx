import React from "react";
import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import AuthForm from "@/components/auth-form/auth-form";
import SplitScreen from "@/components/auth-form/split-screen";

const NewPassword: NextPage = () => {
  const { t } = useTranslation("new-password");

  return (
    <SplitScreen>
      <AuthForm
        formType="newPassword"
        title={t("new password")}
        description={t("dont forget your password")}
        fields={[
          {
            type: "password",
            placeholder: t("enter your new password"),
            key: "password",
          },
          {
            type: "password",
            placeholder: t("confirm your password"),
            key: "passwordConfirmation",
          },
        ]}
      />
    </SplitScreen>
  );
};

export default NewPassword;
