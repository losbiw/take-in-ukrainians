import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
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
import Description from "@/components/general/description";
import { Button } from "@/components/buttons/buttons";
import colors from "@/constants/colors";

export interface PageData {
  current: number;
  total: number;
}

interface Props {
  posts: PostType[];
  pageData: PageData;
  isResidenceOnly: boolean;
}

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
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

const CreateOfferSuggestion = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 3rem 2rem;
  margin: 3rem 0;
  border-radius: 2rem;
  border: 1px solid ${colors.grey};

  ${breakpoints.lg} {
    margin: 3rem 7rem;
  }
`;

const Feed: NextPage<Props> = ({ posts, pageData, isResidenceOnly }: Props) => {
  const router = useRouter();
  const {
    query: { offersOnly },
  } = router;
  const { t } = useTranslation("feed");
  const [city, setCity] = useState<City>();

  const createOfferHref = `/dashboard/create${
    offersOnly && !isResidenceOnly ? `?offerType=residence` : ""
  }`;

  useEffect(() => {
    if (city) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, cityId: city.city_id },
      });
    }
  }, [city]);

  const pushOfferFilterToQuery = (offersOnlyParam: boolean) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, offersOnly: offersOnlyParam },
    });
  };

  return (
    <>
      <MetaTags
        title={`${isResidenceOnly ? t("residences") : t("refugees")} ${
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
              type="button"
              isActive={isResidenceOnly}
            >
              {t("residences")}
            </Radio>

            <Radio
              onClick={() => pushOfferFilterToQuery(false)}
              type="button"
              isActive={offersOnly === "false"}
            >
              {t("refugees")}
            </Radio>
          </RadioContainer>
        </Filters>

        <PostsContainer posts={posts} />

        {pageData.current === pageData.total && (
          <CreateOfferSuggestion>
            <Title>{t("cant find anything")}</Title>
            <Description>{t("try to create a publication")}</Description>

            <Link href="/dashboard/create" as={createOfferHref}>
              <Button href={createOfferHref}>{t("create an offer")}</Button>
            </Link>
          </CreateOfferSuggestion>
        )}

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

  if (!offersOnly) {
    return {
      redirect: {
        permanent: true,
        destination: `/feed/${currentPage || 1}?offersOnly=true`,
      },
    };
  }

  const pagesTotal = await getPagesTotal();

  const isResidenceOnly = offersOnly === "true";

  const returnData = {
    props: {
      pageData: {
        current: currentPage,
        total: pagesTotal,
      },
      isResidenceOnly,
      posts: [],
    },
  };

  try {
    const posts = await getPosts(
      currentPage || 1,
      isResidenceOnly,
      cityId as string | undefined
    );

    (returnData.props.posts as any[]) = posts;

    return returnData;
  } catch {
    return returnData;
  }
};

export default Feed;
