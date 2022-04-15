import { GetServerSideProps } from "next";
import React, { FC } from "react";
import PostForm from "@/components/posts/post-form";
import Post from "@/types/post";
import { getPost } from "@/pages/api/post/[pid]";

interface Props {
  post: Post;
}

const EditPost: FC<Props> = ({ post }) => <PostForm post={post} />;

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
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
};

export default EditPost;
