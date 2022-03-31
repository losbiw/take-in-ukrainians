import React from "react";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";

const Home: NextPage = () => (
  <div>
    <h1>Hello world</h1>
  </div>
);

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  console.log(ctx.req.cookies);

  return {
    props: {},
  };
};

export default Home;
