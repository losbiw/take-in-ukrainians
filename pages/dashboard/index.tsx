import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import Link from "next/link";
import Page from "@/components/general/page";
import { Title } from "@/components/general/title";
import Post from "@/types/post";
import PostsContainer from "@/components/posts/posts-container";
import { getUsersPosts } from "../api/user/posts";
import parseJwt from "@/helpers/parseJwt";
import { InputStyles } from "@/components/inputs/input";
import colors from "@/constants/colors";

interface Props {
  usersPosts: Post[];
}

const CreateOffer = styled.a`
  ${InputStyles}

  display: block;
  color: ${colors.white};
  background-color: ${colors.blue};
  font-weight: 500;
  border: none;
  margin: 2.5rem auto;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

const Dashboard: NextPage<Props> = ({ usersPosts }: Props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Page isNavIncluded>
      <Title>{t("posts")}</Title>

      <PostsContainer areControlsEnabled posts={usersPosts} />

      <Link href="/dashboard/create">
        <CreateOffer href="/dashboard/create">{t("create_offer")}</CreateOffer>
      </Link>
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
