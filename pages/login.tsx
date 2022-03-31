import React from "react";
import { NextPage, GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import Link from "next/link";
import SplitScreen from "@/components/auth-form/split-screen";
import Information from "@/components/auth-form/information";
import AuthForm from "@/components/auth-form/auth-form";
import colors from "@/constants/colors";

const SignupLink = styled.a`
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

const Login: NextPage = () => {
  const { t } = useTranslation();

  return (
    <SplitScreen>
      <AuthForm
        title={t("login:login")}
        description={t("login:login_to_publish")}
        formType="login"
        fields={[
          { type: "email", placeholder: t("login:email"), key: "email" },
          {
            type: "password",
            placeholder: t("login:password"),
            key: "password",
          },
        ]}
      >
        <Link href="/signup">
          <SignupLink href="/signup">
            {t("login:dont_have_account")}{" "}
            <span className="highlited">{t("login:signup")}</span>
          </SignupLink>
        </Link>
      </AuthForm>

      <Information
        title={t("login:couple_of_clicks")}
        description={t("login:give_a_chance")}
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
