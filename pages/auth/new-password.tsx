import React from "react";
import { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import jwt from "jsonwebtoken";
import AuthForm from "@/components/auth-form/auth-form";
import SplitScreen from "@/components/auth-form/split-screen";

interface Props {
  token: string;
}

const NewPassword: NextPage<Props> = ({ token }: Props) => {
  const { t } = useTranslation("new-password");

  return (
    <SplitScreen>
      <AuthForm
        formType="new-password"
        title={t("new password")}
        description={t("dont forget your password")}
        token={token}
        fields={[
          {
            type: "password",
            placeholder: t("enter your new password"),
            key: "password",
          },
          {
            type: "password",
            placeholder: t("confirm your new password"),
            key: "passwordConfirmation",
          },
        ]}
      />
    </SplitScreen>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { token },
    req: { cookies },
  } = ctx;

  if (cookies.token) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  try {
    jwt.verify(token as string, process.env.JWT_SECRET);

    return {
      props: {
        token,
      },
    };
  } catch {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: true,
      },
    };
  }
};

export default NewPassword;
