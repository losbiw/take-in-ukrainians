import React, { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import Page from "@/components/general/page";
import { Title } from "@/components/general/title";
import Post from "@/types/post";
import PostsContainer from "@/components/posts/posts-container";
import { getUsersPosts } from "../api/user/posts";
import parseJwt from "@/helpers/parseJwt";
import server from "@/constants/server";
import Error from "@/components/general/error";
import { Button, DangerousButton } from "@/components/buttons/buttons";
import MetaTags from "@/components/general/meta";

interface Props {
  usersPosts: Post[];
}

const ButtonsContainer = styled.div`
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:first-child {
    margin-top: 0;
  }
`;

const Dashboard: NextPage<Props> = ({ usersPosts }: Props) => {
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    const res = await fetch(`${server}/api/auth/logout`);

    if (res.ok) {
      router.push(`${server}/auth/login`);
    } else {
      const json = await res.json();

      setError(json.message);
    }
  };

  return (
    <>
      <MetaTags title={`${t("general:dashboard")} | Take in Ukrainians`} />

      <Page isNavIncluded>
        {!!usersPosts.length && (
          <>
            <Title>{t("posts")}</Title>
            <PostsContainer areControlsEnabled posts={usersPosts} />
          </>
        )}

        <ButtonsContainer>
          <Link href="/dashboard/create">
            <Button href="/dashboard/create">{t("create_offer")}</Button>
          </Link>

          <DangerousButton onClick={handleLogout}>
            {t("logout")}
          </DangerousButton>

          {error && <Error>{error}</Error>}

          <Link href="/auth/delete">
            <DangerousButton href="/auth/delete">
              {t("delete_account")}
            </DangerousButton>
          </Link>
        </ButtonsContainer>
      </Page>
    </>
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
