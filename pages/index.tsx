import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import Nav from "@/components/nav/nav";
import Banner from "@/components/banner/Banner";

const Home: NextPage = () => (
  <div>
    <Nav />
    <Banner />
  </div>
);

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

export default Home;
