import React from "react";
import { NextPage, GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import SplitScreen from "@/components/auth-form/split-screen";
import Information from "@/components/auth-form/information";
import AuthForm from "@/components/auth-form/auth-form";

const Login: NextPage = () => {
  const { t } = useTranslation("login");

  return (
    <SplitScreen>
      <AuthForm
        title={t("login")}
        description={t("login_to_publish")}
        formType="login"
        fields={[
          { type: "email", placeholder: t("email"), key: "email" },
          {
            type: "password",
            placeholder: t("password"),
            key: "password",
          },
        ]}
        authLink={{
          text: t("dont_have_account"),
          highlited: t("signup"),
          href: "/auth/signup",
        }}
      />

      <Information
        title={t("couple_of_clicks")}
        description={t("give_a_chance")}
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

export default Login;
