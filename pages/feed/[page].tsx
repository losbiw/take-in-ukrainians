import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import PostType from "@/types/post";
import PostsContainer from "@/components/posts/posts-container";
import Page from "@/components/general/page";
import { Title } from "@/components/general/title";
import { getPosts } from "../api/posts";
import { getPagesTotal } from "../api/posts/pages";
import CitySearchBar from "@/components/city-search-bar";
import City from "@/types/city";
import PageButtons from "@/components/feed/page-buttons";
import breakpoints from "@/constants/breakpoints";
import RawRadio from "@/components/inputs/radio";
import MetaTags from "@/components/general/meta";

export interface PageData {
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
  margin-top: 4rem;
`;

const Filters = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;

  ${breakpoints.sm} {
    gap: 1.5rem;
    flex-direction: row;
    margin-bottom: 0;
  }
`;

const RadioContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Radio = styled(RawRadio)`
  width: auto;
  font-weight: 500;
`;

const Feed: NextPage<Props> = ({ posts, pageData }: Props) => {
  const router = useRouter();
  const { t } = useTranslation("feed");
  const [city, setCity] = useState<City>();

  const isResidencesOnly = router.query.offersOnly === "true";

  useEffect(() => {
    if (city) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, cityId: city.city_id },
      });
    }
  }, [city]);

  const pushOfferFilterToQuery = (offersOnly: boolean) => {
    router.query.offersOnly = `${offersOnly}`;
    router.push(router);
  };

  return (
    <>
      <MetaTags
        title={`${isResidencesOnly ? t("residences") : t("refugees")} ${
          city ? ` ${t("in")} ${city.city_name}` : ""
        } | Take in Ukrainians`}
      />
      <Page isNavIncluded>
        <Title>Posts</Title>

        <Filters>
          <CitySearchBar setCity={setCity} />

          <RadioContainer>
            <Radio
              onClick={() => pushOfferFilterToQuery(true)}
              isActive={isResidencesOnly}
            >
              {t("residences")}
            </Radio>

            <Radio
              onClick={() => pushOfferFilterToQuery(false)}
              isActive={router.query.offersOnly === "false"}
            >
              {t("refugees")}
            </Radio>
          </RadioContainer>
        </Filters>

        <PostsContainer posts={posts} />

        <ButtonsContainer>
          <PageButtons pageData={pageData} />
        </ButtonsContainer>
      </Page>
    </>
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

  const returnData = {
    props: {
      pageData: {
        current: currentPage,
        total: pagesTotal,
      },
      posts: [],
    },
  };

  try {
    const posts = await getPosts(
      currentPage || 1,
      offersOnly ? offersOnly === "true" : undefined,
      cityId as string | undefined
    );

    (returnData.props.posts as any[]) = posts;

    return returnData;
  } catch {
    return returnData;
  }
};

export default Feed;
