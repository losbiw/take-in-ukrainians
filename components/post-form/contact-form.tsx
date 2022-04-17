import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React, { FC, useState } from "react";
import styled from "styled-components";
import socialMedia from "@/constants/socials";
import { InputStyles } from "../inputs/input";
import { Title } from "../general/title";
import Subtitle from "../general/subtitle";
import colors from "@/constants/colors";
import ContactPopup from "./contact-popup";

type SocialMedia = keyof typeof socialMedia;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Field = styled.button<{ isFilledOut: boolean }>`
  ${InputStyles}

  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: ${({ isFilledOut }) =>
    isFilledOut ? colors.blue : colors.grey};

  &:hover {
    p {
      color
    }
  }

  p {
    color: ${colors.black};
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }

  img {
    height: 1.8rem;
    margin-right: 0.9rem;
    ${({ isFilledOut }) => (isFilledOut ? "" : "filter: grayscale(100%);")}
  }
`;

const ContactForm: FC = () => {
  const { t } = useTranslation("contact");
  const [popupKey, setPopupKey] = useState<SocialMedia | null>(null);

  const handleClick = (key: SocialMedia) => {
    setPopupKey(key);
  };

  return (
    <Container>
      <Title>{t("contact information")}</Title>
      <Subtitle>{t("only fill out ones that you want")}</Subtitle>

      {Object.keys(socialMedia).map((key) => (
        <Field
          isFilledOut={false}
          key={key}
          onClick={() => handleClick(key as SocialMedia)}
        >
          <img
            src={`/assets/social-media/${key}.png`}
            alt={`${key} logotype`}
          />
          <p>{socialMedia[key].name}</p>
        </Field>
      ))}

      {popupKey && (
        <ContactPopup
          placeholder={t(socialMedia[popupKey].placeholder)}
          closePopup={() => setPopupKey(null)}
        />
      )}
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {},
});

export default ContactForm;
