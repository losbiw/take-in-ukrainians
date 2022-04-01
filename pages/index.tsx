import React from "react";
import type { GetServerSideProps, NextPage } from "next";

const Home: NextPage = () => (
  <div>
    <h1>Hello world</h1>
  </div>
);

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

export default Home;
