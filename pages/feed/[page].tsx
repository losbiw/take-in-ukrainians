import { GetServerSideProps, NextPage } from "next";
import React from "react";
import PostType from "@/types/post";
import PostsContainer from "@/components/posts/posts-container";
import Page from "@/components/general/page";
import { Title } from "@/components/general/title";
import { getPosts } from "../api/posts";

interface Props {
  posts: PostType[];
}

// eslint-disable-next-line react/prop-types
const Feed: NextPage<Props> = ({ posts }: Props) => (
  <Page isNavIncluded>
    <Title>Posts</Title>

    <PostsContainer posts={posts} />
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    params,
    query: { offersOnly },
  } = ctx;

  const page = params?.page;
  const pageNumber = parseInt(page as string, 10);

  try {
    const posts = getPosts(
      pageNumber || 1,
      offersOnly ? offersOnly === "true" : undefined
    );

    return {
      props: {
        posts,
      },
    };
  } catch {
    return {
      props: {
        posts: [],
      },
    };
  }
};

export default Feed;
