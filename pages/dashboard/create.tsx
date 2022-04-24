import { GetServerSideProps, NextPage } from "next";
import React from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import PostForm from "@/components/post-form/post-form";
import parseJwt from "@/helpers/parseJwt";
import { getContactInfo } from "../api/user/contact";
import { ContactData } from "@/components/post-form/contact-form";

interface Props {
  contacts: ContactData;
}

const CreatePost: NextPage<Props> = ({ contacts }: Props) => {
  const { t } = useTranslation("create-post");

  return (
    <>
      <Head>
        <title>{t("create_an_offer")} | Take in Ukrainians</title>
      </Head>
      <PostForm contacts={contacts} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    cookies: { token },
  } = ctx.req;

  try {
    const { user_id } = parseJwt(token);
    const contacts = await getContactInfo(user_id);

    return {
      props: {
        contacts,
      },
    };
  } catch {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: true,
      },
    };
  }
};

export default CreatePost;
