import React, { FC } from "react";
import styled from "styled-components";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import colors from "@/constants/colors";
import PostType from "@/types/post";
import Subtitle from "../general/subtitle";

const Container = styled.a`
  padding: 1.5rem 2rem;
  border-radius: 2rem;
  border: 1px solid ${colors.grey};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.7rem 0;
`;

const Icon = styled.img`
  width: 1rem;
  height: 1rem;
  margin-right: 0.9rem;
`;

const Title = styled(Subtitle)`
  margin: 0.8rem 0 1.2rem;
`;

const Text = styled.p`
  color: ${colors.grey};
  font-size: 0.9rem;
  margin: 0;
`;

const Post: FC<Pick<PostType, "title" | "city" | "max_people" | "post_id">> = ({
  title,
  city,
  max_people,
  post_id,
}) => {
  const { t } = useTranslation();

  const href = `/feed/${post_id}`;

  return (
    <Link href={href}>
      <Container href="href">
        <Title>{title}</Title>

        <IconContainer>
          <Icon src="/assets/icons/geolocation.png" />
          <Text>{city}</Text>
        </IconContainer>

        <IconContainer>
          <Icon src="/assets/icons/person.png" />
          <Text>
            {t("post:max_people")}: {max_people}
          </Text>
        </IconContainer>
      </Container>
    </Link>
  );
};

export default Post;
