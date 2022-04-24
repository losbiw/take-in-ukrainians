import React, { memo } from "react";
import { NextPage, GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import Head from "next/head";
import SplitScreen from "@/components/auth-form/split-screen";
import Information from "@/components/auth-form/information";
import AuthForm from "@/components/auth-form/auth-form";
import Description from "@/components/general/description";
import colors from "@/constants/colors";

const StyledLink = styled.a`
  color: ${colors.blue};
  text-decoration: underline;
`;

const Signup: NextPage = () => {
  const { t } = useTranslation("signup");

  return (
    <>
      <Head>
        <title>{t("signup")} | Take in Ukrainians</title>
      </Head>

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
          innerCardInfo={{
            title: t("the app is free"),
            images: [
              "/assets/charities/un.png",
              "/assets/charities/ukr-army.png",
              "/assets/charities/come-back-alive.png",
            ],
            Description: memo(() => (
              <Description>
                {t("all we're asking to do")}{" "}
                <StyledLink target="_blank" href="https://standforukraine.com/">
                  {t("donate")}
                </StyledLink>{" "}
                {t("to the ukrainian army and other charities")}
              </Description>
            )),
          }}
        />
      </SplitScreen>
    </>
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
