import { GetServerSideProps } from "next";
import React, { FC } from "react";
import useTranslation from "next-translate/useTranslation";
import PostForm from "@/components/publication-form/form";
import Post from "@/types/post";
import { getPost } from "@/pages/api/post/[pid]";
import parseJwt from "@/helpers/parseJwt";
import { getContactInfo } from "@/pages/api/user/contact";
import MetaTags from "@/components/general/meta";
import { ContactData } from "@/types/contacts";

interface Props {
  post: Post;
  contacts: ContactData;
}

const EditPost: FC<Props> = ({ post, contacts }) => {
  const { t } = useTranslation("create-post");

  return (
    <>
      <MetaTags title={`${t("edit_the_offer")} | Take in Ukrainians`} />
      <PostForm post={post} contacts={contacts} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    cookies: { token },
  } = ctx.req;
  const pid = ctx.params?.pid;

  try {
    const { user_id } = parseJwt(token);
    const parsedId = parseInt(pid as string, 10);
    const post = await getPost(parsedId);

    const contacts = await getContactInfo(user_id);

    return {
      props: {
        post,
        contacts,
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
