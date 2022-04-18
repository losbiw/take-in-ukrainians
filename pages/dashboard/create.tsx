import { GetServerSideProps, NextPage } from "next";
import React from "react";
import PostForm from "@/components/post-form/post-form";
import parseJwt from "@/helpers/parseJwt";
import { getContactInfo } from "../api/user/contact";
import { ContactProps } from "@/components/post-form/contact-form";

interface Props {
  contacts: ContactProps;
}

const CreatePost: NextPage<Props> = ({ contacts }: Props) => (
  <PostForm contacts={contacts} />
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    cookies: { token },
  } = ctx.req;

  const { user_id } = parseJwt(token);
  const contacts = await getContactInfo(user_id);

  return {
    props: {
      contacts,
    },
  };
};

export default CreatePost;
