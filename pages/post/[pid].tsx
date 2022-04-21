import { GetServerSideProps } from "next";
import React, { FC } from "react";
import styled from "styled-components";
import Page from "@/components/general/page";
import Post from "@/types/post";
import { Title } from "@/components/general/title";
import Description from "@/components/general/description";
import PostInformation from "@/components/posts/post-information";
import { getPost } from "../api/post/[pid]";
import { getContactInfo } from "../api/user/contact";
import ContactForm, { ContactData } from "@/components/post-form/contact-form";
import breakpoints from "@/constants/breakpoints";

interface Props {
  post: Post;
  contacts: ContactData;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin: 4rem auto;
  gap: 3rem;

  ${breakpoints.lg} {
    gap: 6rem;
    grid-template-columns: 1fr 1fr;
    padding: 1rem;
  }
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PostPage: FC<Props> = ({ post, contacts }) => {
  const { title, description } = post;

  return (
    <Page isNavIncluded>
      <Container>
        <PostInfo>
          <Title>{title}</Title>
          <Description>{description}</Description>

          <PostInformation {...post} />
        </PostInfo>

        <ContactForm isEditable={false} contacts={contacts} />
      </Container>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const pid = ctx.params?.pid;

  try {
    const parsedId = parseInt(pid as string, 10);
    const post = (await getPost(parsedId)) as Post;

    const contacts = await getContactInfo(post.user_id);

    return {
      props: {
        post,
        contacts,
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default PostPage;
