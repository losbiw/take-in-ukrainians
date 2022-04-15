import { GetServerSideProps } from "next";
import React, { FC } from "react";
import Page from "@/components/general/page";
import Post from "@/types/post";
import { Title } from "@/components/general/title";
import Description from "@/components/general/description";
import SplitScreen from "@/components/auth-form/split-screen";
import PostInformation from "@/components/posts/post-information";
import { getPost } from "../api/post";

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
  const pid = ctx.params?.pid;

  try {
    const parsedId = parseInt(pid as string, 10);
    const post = await getPost(parsedId);

    return {
      props: {
        post,
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default PostPage;
