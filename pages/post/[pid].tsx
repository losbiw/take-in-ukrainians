import { GetServerSideProps } from "next";
import React, { FC } from "react";
import styled from "styled-components";
import jwt, { JwtPayload } from "jsonwebtoken";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import Page from "@/components/general/page";
import Post from "@/types/post";
import { Title } from "@/components/general/title";
import Description from "@/components/general/description";
import PostInformation from "@/components/posts/post-information";
import { getPost } from "../api/post/[pid]";
import { getContactInfo } from "../api/user/contact";
import ContactForm, { ContactData } from "@/components/post-form/contact-form";
import breakpoints from "@/constants/breakpoints";
import { Button as RawButton } from "@/components/buttons/buttons";

interface Props {
  post: Post;
  contacts: ContactData;
  isEditable: boolean;
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

const Button = styled(RawButton)`
  margin-top: 2rem;
`;

const PostPage: FC<Props> = ({ post, contacts, isEditable }) => {
  const { t } = useTranslation("create-post");
  const { title, description } = post;

  return (
    <Page isNavIncluded>
      <Container>
        <PostInfo>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}

          <PostInformation {...post} />

          {isEditable && (
            <Link href={`/dashboard/edit/${post.post_id}`}>
              <Button href={`/dashboard/edit/${post.post_id}`}>
                {t("edit_the_offer")}
              </Button>
            </Link>
          )}
        </PostInfo>

        <ContactForm isEditable={false} contacts={contacts} />
      </Container>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    req: {
      cookies: { token },
    },
    params,
  } = ctx;
  const pid = params?.pid;

  try {
    let isEditable = false;
    const parsedId = parseInt(pid as string, 10);
    const post = (await getPost(parsedId)) as Post;

    try {
      if (token) {
        const { user_id } = jwt.verify(
          token,
          process.env.JWT_SECRET
        ) as JwtPayload;

        if (user_id === post.user_id) isEditable = true;
      }
    } catch {
      ctx.res.setHeader(
        "Set-Cookie",
        "token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
    }

    const contacts = await getContactInfo(post.user_id);

    return {
      props: {
        post,
        contacts,
        isEditable,
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default PostPage;
