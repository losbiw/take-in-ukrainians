import { GetServerSideProps, NextPage } from "next";
import React from "react";
import PostType from "@/types/post";
import server from "@/constants/server";
import PostsContainer from "@/components/posts/posts-container";
import Page from "@/components/general/page";
import { Title } from "@/components/general/title";

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
  const posts = await fetch(`${server}/api/posts?page=${ctx.query.page || 1}`);
  const json = await posts.json();

  if (!ctx.query.page) {
    ctx.query.page = "1";
  }

  return {
    props: {
      posts: json.posts as PostType[],
    },
  };
};

export default Feed;
