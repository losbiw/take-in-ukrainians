import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import Link from "next/link";
import Nav from "@/components/nav/nav";
import Banner from "@/components/banner/Banner";
import Page from "@/components/general/page";
import server from "@/constants/server";
import { Title as RawTitle } from "@/components/general/title";
import RawDescription from "@/components/general/description";
import { InputStyles } from "@/components/inputs/input";
import colors from "@/constants/colors";
import PostsContainer from "@/components/posts/posts-container";
import Post from "@/types/post";
import Error from "@/components/general/error";
import breakpoints from "@/constants/breakpoints";
import MetaTags from "@/components/general/meta";

const Title = styled(RawTitle)`
  margin: 5rem 0 2rem;
  text-align: center;

  &:first-child {
    margin-top: 0;
  }
`;

const Description = styled(RawDescription)`
  text-align: center;
  margin: 0 auto 2rem;

  ${breakpoints.lg} {
    max-width: 70%;
  }
`;

const SeeMoreLink = styled.a`
  ${InputStyles}

  display: block;
  color: ${colors.white};
  background-color: ${colors.blue};
  font-weight: 500;
  border: none;
  margin: 3rem auto 2.5rem;
  text-align: center;

  &:hover {
    transform: scale(1.03);
  }

  ${breakpoints.md} {
    width: 40%;
  }
`;

const PostsWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 2rem;
`;

const Home: NextPage = () => {
  const { t } = useTranslation("home");
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  // eslint-disable-next-line consistent-return
  const fetchPosts = useCallback(async () => {
    const res = await fetch(`${server}/api/posts?page=1`);
    const json = await res.json();

    if (res.ok) {
      return setPosts(json.posts);
    }

    setError(json.message);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <MetaTags title="Take in Ukrainians" />

      <Nav />
      <Banner />

      <Page isNavIncluded={false}>
        <Title>{t("if_youre_looking_for_a_place")}</Title>
        <Description>{t("youre_not_alone")}</Description>

        <PostsWrapper>
          <PostsContainer
            posts={posts.filter(({ is_offering }) => is_offering).slice(0, 6)}
          />
        </PostsWrapper>

        {error && <Error>{error}</Error>}

        <Link href="/feed/1?offersOnly=false">
          <SeeMoreLink href="/feed/1?offersOnly=false">
            {t("see_more_residences")}
          </SeeMoreLink>
        </Link>

        <Title>{t("if_youre_looking_to_take_in")}</Title>

        <PostsWrapper>
          <PostsContainer
            posts={posts.filter(({ is_offering }) => !is_offering).slice(0, 6)}
          />
        </PostsWrapper>

        {error && <Error>{error}</Error>}

        <Link href="/feed/1?offersOnly=false">
          <SeeMoreLink href="/feed/1?offersOnly=false">
            {t("see_more_refugees")}
          </SeeMoreLink>
        </Link>
      </Page>
    </div>
  );
};

export default Home;
