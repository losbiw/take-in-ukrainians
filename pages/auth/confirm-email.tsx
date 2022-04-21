import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { confirmEmail } from "../api/email/confirm";

const EmailConfirmation: NextPage = () => <div />;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { token },
  } = ctx;

  try {
    await confirmEmail(token as string);

    return {
      redirect: {
        destination: "/auth/login",
        permanent: true,
      },
    };
  } catch {
    return {
      redirect: {
        destination: "/auth/login?error=Your%20could%20not%2be%confirmed",
        permanent: true,
      },
    };
  }
};

export default EmailConfirmation;
