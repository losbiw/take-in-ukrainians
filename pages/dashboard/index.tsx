import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import verifyJWT from "@/helpers/jwt";
import Page from "@/components/general/page";
import { Title } from "@/components/general/title";
import Post from "@/types/post";
import PostsContainer from "@/components/posts/posts-container";
import server from "@/constants/server";

interface Props {
  userPosts: Post[];
}

const Dashboard: NextPage<Props> = ({ userPosts }: Props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Page isNavIncluded>
      <Title>{t("posts")}</Title>

      <PostsContainer areControlsEnabled posts={userPosts} />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    cookies: { token },
  } = ctx.req;
  const verification = await verifyJWT.client(ctx);

  if (typeof verification !== "boolean") return verification;

  const res = await fetch(`${server}/api/user/posts`, {
    headers: {
      Cookie: `token=${token}`,
    },
  });
  const json = await res.json();

  return {
    props: {
      userPosts: json.posts,
    },
  };
};

export default Dashboard;
