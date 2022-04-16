import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import PostType from "@/types/post";
import PostsContainer from "@/components/posts/posts-container";
import Page from "@/components/general/page";
import { Title } from "@/components/general/title";
import { getPosts } from "../api/posts";
import { getPagesTotal } from "../api/posts/pages";
import colors from "@/constants/colors";
import CitySearchBar from "@/components/city-search-bar";
import City from "@/types/city";

interface PageData {
  current: number;
  total: number;
}

interface Props {
  posts: PostType[];
  pageData: PageData;
}

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`;

const PageButton = styled.a<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: ${({ isActive }) => (isActive ? colors.white : colors.grey)};
  background-color: ${({ isActive }) =>
    isActive ? colors.blue : colors.white};
  border: none;
  border-radius: 50%;
  margin: 0 0.5rem;

  ${({ isActive }) => (isActive ? "pointer-events: none;" : "")}
`;

const Dots = styled.p`
  font-size: 1.5rem;
  margin: 0 1rem;
  colors: ${colors.grey};
`;

const getInitialIndex = ({ current, total }: PageData) => {
  if (current === 1) return 1;
  if (current === total) return current - 2;

  return current - 1;
};

const renderPagesButtons = (
  pageData: PageData,
  parsedQuery: ParsedUrlQuery
) => {
  const { current, total } = pageData;
  const buttons = [];

  const initialIndex = getInitialIndex(pageData);
  const finalIndex = total < 3 ? total : initialIndex + 2;

  const queryKeys = Object.keys(parsedQuery);
  const pageParamIndex = queryKeys.indexOf("page");

  queryKeys.splice(pageParamIndex);

  const query = queryKeys.reduce((acc, key, i) => {
    if (key !== "page") {
      return `${acc}${key}=${parsedQuery[key]}${
        i !== queryKeys.length - 1 ? "&" : ""
      }`;
    }
    return acc;
  }, "");

  for (let i = initialIndex; i <= finalIndex; i++) {
    const isCurrent = i === current;

    const href = `/feed/${i}?${query}`;

    buttons.push(
      <Link href={href} key={href}>
        <PageButton href={href} isActive={isCurrent}>
          {i}
        </PageButton>
      </Link>
    );
  }

  if (finalIndex < total) {
    const href = `/feed/${total}?${query}`;

    buttons.push(
      <>
        <Dots>...</Dots>
        <Link href={href} key={href}>
          <PageButton href={href}>{total}</PageButton>
        </Link>
      </>
    );
  }

  return buttons;
};

const Feed: NextPage<Props> = ({ posts, pageData }: Props) => {
  const router = useRouter();
  const [city, setCity] = useState<City>();

  useEffect(() => {
    if (city) {
      router.query.cityId = city.city_id;
      router.push(router);
    }
  }, [city]);

  return (
    <Page isNavIncluded>
      <Title>Posts</Title>

      <CitySearchBar setCity={setCity} />

      <PostsContainer posts={posts} />

      <ButtonsContainer>
        {renderPagesButtons(pageData, router.query)}
      </ButtonsContainer>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    params,
    query: { offersOnly, cityId },
  } = ctx;

  const page = params?.page;
  const currentPage = parseInt(page as string, 10);
  const pagesTotal = await getPagesTotal();

  try {
    const posts = await getPosts(
      currentPage || 1,
      offersOnly ? offersOnly === "true" : undefined,
      cityId as string | undefined
    );

    return {
      props: {
        pageData: {
          current: currentPage,
          total: pagesTotal,
        },
        posts,
      },
    };
  } catch {
    return {
      props: {
        pageData: {
          current: currentPage,
          total: pagesTotal,
        },
        posts: [],
      },
    };
  }
};

export default Feed;
