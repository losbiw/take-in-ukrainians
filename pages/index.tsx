import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import Link from "next/link";
import Nav from "@/components/nav/nav";
import Banner from "@/components/banner/Banner";
import Page from "@/components/general/page";
import { Title as RawTitle } from "@/components/general/title";
import RawDescription from "@/components/general/description";
import { InputStyles } from "@/components/inputs/input";
import colors from "@/constants/colors";
import PostsContainer from "@/components/publications/container";
import Post from "@/types/post";
import Error from "@/components/general/error";
import breakpoints from "@/constants/breakpoints";
import MetaTags from "@/components/general/meta";
import { getPosts } from "./api/posts";

interface Props {
  offers: Post[];
  refugees: Post[];
  error?: string;
}

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

const Home: NextPage<Props> = ({ offers, refugees, error }: Props) => {
  const { t } = useTranslation("home");

  return (
    <div>
      <MetaTags title="Take in Ukrainians" />

      <Nav />
      <Banner />

      <Page isNavIncluded={false}>
        <Title>{t("if_youre_looking_for_a_place")}</Title>
        <Description>{t("youre_not_alone")}</Description>

        <PostsContainer posts={offers} />

        {error && <Error>{error}</Error>}

        <Link href="/feed/1?offersOnly=false">
          <SeeMoreLink href="/feed/1?offersOnly=false">
            {t("see_more_residences")}
          </SeeMoreLink>
        </Link>

        <Title>{t("if_youre_looking_to_take_in")}</Title>

        <PostsContainer posts={refugees} />

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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const offers = await getPosts(1, { offersOnly: true });
    const refugees = await getPosts(1, { offersOnly: false });

    return {
      props: {
        offers: offers.slice(0, 6),
        refugees: refugees.slice(0, 6),
      },
    };
  } catch {
    return {
      props: {
        offers: [],
        refugees: [],
        error: "Something went wrong, please try again later",
      },
    };
  }
};

export default Home;
