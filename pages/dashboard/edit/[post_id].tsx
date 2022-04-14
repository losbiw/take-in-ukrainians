import { GetServerSideProps } from "next";
import React, { FC } from "react";
import PostForm from "@/components/posts/post-form";
import { getPost } from "@/pages/api/post";
import Post from "@/types/post";

interface Props {
  post: Post;
}

const EditPost: FC<Props> = ({ post }) => <PostForm post={post} />;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const postId = ctx.params?.post_id;

  try {
    const parsedId = parseInt(postId as string, 10);
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
