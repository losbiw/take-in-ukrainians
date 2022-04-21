import { GetServerSideProps, NextPage } from "next";
import jwt from "jsonwebtoken";
import React from "react";

const ConfirmEmail: NextPage = () => <div />;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { token },
  } = ctx;

  try {
    jwt.verify(token as string, process.env.JWT_SECRET);

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

export default ConfirmEmail;
