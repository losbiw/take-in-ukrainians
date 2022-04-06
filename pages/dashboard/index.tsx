import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import Nav from "@/components/nav/nav";
import verifyJWT from "@/helpers/jwt";

const Dashboard: NextPage = () => (
  <div>
    <Nav />
  </div>
);

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  verifyJWT.client(ctx);

export default Dashboard;
