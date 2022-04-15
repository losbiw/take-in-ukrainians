import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Page from "@/components/general/page";
import { Title } from "@/components/general/title";
import Post from "@/types/post";
import PostsContainer from "@/components/posts/posts-container";
import { getUsersPosts } from "../api/user/posts";
import parseJwt from "@/helpers/parseJwt";

interface Props {
  usersPosts: Post[];
}

const Dashboard: NextPage<Props> = ({ usersPosts }: Props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Page isNavIncluded>
      <Title>{t("posts")}</Title>

      <PostsContainer areControlsEnabled posts={usersPosts} />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.req.cookies;

  const { user_id } = parseJwt(token);
  const usersPosts = await getUsersPosts(user_id);

  return {
    props: {
      usersPosts,
    },
  };
};

export default Dashboard;
