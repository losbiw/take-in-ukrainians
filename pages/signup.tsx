import React from "react";
import { NextPage, GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import Link from "next/link";
import SplitScreen from "@/components/auth-form/split-screen";
import Information from "@/components/auth-form/information";
import AuthForm from "@/components/auth-form/auth-form";
import colors from "@/constants/colors";

const LoginLink = styled.a`
  font-size: 0.9rem;
  color: ${colors.grey};
  margin: 3rem 0 0;
  transition: 0.1s;

  &:hover {
    color: ${colors.darkGrey};
  }

  & .highlited {
    color: ${colors.blue};
    text-decoration: underline;
  }
`;

const Signup: NextPage = () => {
  const { t } = useTranslation();

  return (
    <SplitScreen>
      <AuthForm
        title={t("signup:signup")}
        description={t("signup:create_account")}
        formType="signup"
        fields={[
          { type: "email", placeholder: t("signup:email"), key: "email" },
          {
            type: "password",
            placeholder: t("signup:password"),
            key: "password",
          },
          {
            type: "password",
            placeholder: t("signup:confirm_password"),
            key: "passwordConfirmation",
          },
        ]}
      >
        <Link href="/login">
          <LoginLink href="/login">
            {t("signup:already_have_account")}{" "}
            <span className="highlited">{t("signup:login")}</span>
          </LoginLink>
        </Link>
      </AuthForm>

      <Information
        title={t("signup:everyone_hero")}
        description={t("signup:become_a_hero")}
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
