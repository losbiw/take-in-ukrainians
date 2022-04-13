import React, { FC } from "react";
import styled from "styled-components";
import useTranslation from "next-translate/useTranslation";
import colors from "@/constants/colors";
import Post from "@/types/post";

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

const Icon = styled.img`
  width: 1rem;
  height: 1rem;
  margin-right: 0.9rem;
`;

const Text = styled.p`
  color: ${colors.grey};
  font-size: 0.9rem;
  margin: 0;
`;

const PostInformation: FC<Post> = ({
  city_name,
  is_offering,
  people_number,
}) => {
  const { t } = useTranslation("post");

  return (
    <>
      <IconContainer>
        <Icon src="/assets/icons/geolocation.png" />
        <Text>{city_name}</Text>
      </IconContainer>

      <IconContainer>
        <Icon src="/assets/icons/person.png" />
        <Text>
          {is_offering ? t("max_people") : t("people_number")}: {people_number}
        </Text>
      </IconContainer>
    </>
  );
};

export default PostInformation;
