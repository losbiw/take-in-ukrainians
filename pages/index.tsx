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

const Title = styled(RawTitle)`
  margin: 5rem 0 2rem;
  text-align: center;
`;

const Description = styled(RawDescription)`
  text-align: center;
  margin: 0 auto 3rem;

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
  margin: 2.5rem auto;
  text-align: center;

  ${breakpoints.md} {
    width: 40%;
  }
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
      <Nav />
      <Banner />

      <Page isNavIncluded={false}>
        <Title>{t("if_youre_looking_for_a_place")}</Title>
        <Description>{t("youre_not_alone")}</Description>

        <PostsContainer
          posts={posts.filter(({ is_offering }) => is_offering).slice(0, 6)}
        />

        {error && <Error>{error}</Error>}

        <Link href="/feed/1?offersOnly=false">
          <SeeMoreLink href="/feed/1?offersOnly=false">
            {t("see_more_residences")}
          </SeeMoreLink>
        </Link>

        <Title>{t("if_youre_looking_to_take_in")}</Title>

        <PostsContainer
          posts={posts.filter(({ is_offering }) => !is_offering).slice(0, 6)}
        />

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
