import React from "react";
import { NextPage, GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import SplitScreen from "@/components/auth-form/split-screen";
import Information from "@/components/auth-form/information";
import AuthForm from "@/components/auth-form/auth-form";

const Signup: NextPage = () => {
  const { t } = useTranslation("signup");

  return (
    <SplitScreen>
      <AuthForm
        title={t("signup")}
        description={t("create_account")}
        formType="signup"
        fields={[
          { type: "email", placeholder: t("email"), key: "email" },
          {
            type: "password",
            placeholder: t("password"),
            key: "password",
          },
          {
            type: "password",
            placeholder: t("confirm_password"),
            key: "passwordConfirmation",
          },
        ]}
        authLink={{
          text: t("already_have_account"),
          highlited: t("login"),
          href: "/auth/login",
        }}
      />

      <Information
        title={t("everyone_hero")}
        description={t("become_a_hero")}
      />
    </SplitScreen>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.req.cookies.token) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Signup;
