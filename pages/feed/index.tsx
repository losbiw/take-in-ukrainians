import { GetServerSideProps } from "next";
import React from "react";

export default () => <div />;

// eslint-disable-next-line import/prefer-default-export
export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/feed/1?offersOnly=true",
    permanent: true,
  },
});
