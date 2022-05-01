import React from "react";
import { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import jwt from "jsonwebtoken";
import AuthForm from "@/components/auth-form/form";
import SplitContainer from "@/components/auth-form/split-screen";
import MetaTags from "@/components/general/meta";

interface Props {
  token: string;
}

const NewPassword: NextPage<Props> = ({ token }: Props) => {
  const { t } = useTranslation("new-password");

  return (
    <>
      <MetaTags title={`${t("new password")} | Take in Ukrainians`} />

      <SplitContainer>
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
      </SplitContainer>
    </>
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
