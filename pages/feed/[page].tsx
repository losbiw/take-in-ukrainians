import { GetServerSideProps, NextPage } from "next";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PostType from "@/types/post";
import PostsContainer from "@/components/publications/container";
import Page from "@/components/general/page";
import { Title } from "@/components/general/title";
import { getPosts } from "../api/posts";
import { getPagesTotal } from "../api/posts/pages";
import PageButtons from "@/components/feed/buttons";
import breakpoints from "@/constants/breakpoints";
import Description from "@/components/general/description";
import { Button } from "@/components/buttons/buttons";
import colors from "@/constants/colors";
import Filters from "@/components/filters/filters";

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

  const publicationCreationHref = `/dashboard/create${
    offersOnly && !isResidenceOnly ? `?offerType=residence` : ""
  }`;

  return (
    <Page isNavIncluded>
      <Filters isResidenceOnly={isResidenceOnly} />

      <PostsContainer posts={posts} />

      {pageData.current === pageData.total && (
        <CreateOfferSuggestion>
          <Title>{t("cant find anything")}</Title>
          <Description>{t("try to create a publication")}</Description>

          <Link href="/dashboard/create" as={publicationCreationHref}>
            <Button href={publicationCreationHref}>
              {t("create an offer")}
            </Button>
          </Link>
        </CreateOfferSuggestion>
      )}

      <ButtonsContainer>
        <PageButtons {...pageData} />
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
