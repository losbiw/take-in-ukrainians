import { GetServerSideProps } from "next";
import React, { FC } from "react";
import server from "@/constants/server";
import Page from "@/components/general/page";
import Post from "@/types/post";
import { Title } from "@/components/general/title";
import Description from "@/components/general/description";
import SplitScreen from "@/components/auth-form/split-screen";
import PostInformation from "@/components/posts/post-information";

const PostPage: FC<Post> = (post) => {
  const { title, description } = post;

  return (
    <Page isNavIncluded>
      <SplitScreen>
        <div>
          <Title>{title}</Title>
          <Description>{description}</Description>

          <PostInformation {...post} />
        </div>
      </SplitScreen>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const post_id = ctx.params?.post_id;

  const redirect: { notFound: true } = {
    notFound: true,
  };

  if (!post_id) return redirect;

  const res = await fetch(`${server}/api/post?post_id=${post_id}`);
  const json = await res.json();

  if (json.post) {
    return {
      props: json.post,
    };
  }

  return redirect;
};

export default PostPage;
