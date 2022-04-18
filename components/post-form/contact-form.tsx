/* eslint-disable react/destructuring-assignment */
import useTranslation from "next-translate/useTranslation";
import React, { FC, useState } from "react";
import styled from "styled-components";
import socialMedia from "@/constants/socials";
import { InputStyles } from "../inputs/input";
import { Title } from "../general/title";
import Subtitle from "../general/subtitle";
import colors from "@/constants/colors";
import ContactPopup from "./contact-popup";
import server from "@/constants/server";

export type SocialMedia = keyof typeof socialMedia;

export type ContactProps = Partial<Record<SocialMedia, string>>;

interface Props {
  contacts: ContactProps;
  isEditable: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  position: relative;
  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
  }
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
    cursor: pointer;

    img {
      ${({ isFilledOut }) => (isFilledOut ? "" : "filter: grayscale(0);")};
    }

    p {
      color: ${({ isFilledOut }) =>
        isFilledOut ? colors.black : colors.darkGrey};
    }
  }

  p {
    color: ${colors.black};
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    transition: 0.2s;
  }

  img {
    height: 1.8rem;
    margin-right: 0.9rem;
    transition: 0.2s;
    ${({ isFilledOut }) => (isFilledOut ? "" : "filter: grayscale(100%);")}
  }
`;

const DeleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  right: 2rem;
  width: 1.6rem;
  height: 1.6rem;
  background-color: ${colors.white};
  border-radius: 50%;
  border: none;
  transition: 0.15s;

  &:hover {
    cursor: pointer;
    background-color: ${colors.grey};
  }
`;

const CrossIcon = styled.img`
  width: 85%;
`;

const ContactForm: FC<Props> = ({ contacts: contactsProps, isEditable }) => {
  const { t } = useTranslation("contact");

  const [popupKey, setPopupKey] = useState<SocialMedia | null>(null);
  const [contacts, setContants] = useState(contactsProps);

  const updateContactsKey = (key: SocialMedia, value: string) => {
    const copy = { ...contactsProps };
    copy[key] = value;

    setContants(copy);
  };

  const handleClick = (key: SocialMedia) => {
    setPopupKey(key);
  };

  const closePopup = (value?: string) => {
    if (value) {
      updateContactsKey(popupKey as string, value);
    }

    setPopupKey(null);
  };

  const handleDelete = async (key: SocialMedia) => {
    const body: any = {};

    body[key] = null;

    const res = await fetch(`${server}/api/user/contact`, {
      method: "DELETE",
      body: JSON.stringify(body),
    });

    if (res.ok) {
      updateContactsKey(key, "");
    }
  };

  return (
    <Container>
      <Title>{t("contact information")}</Title>
      <Subtitle>{t("only fill out ones that you want")}</Subtitle>

      {Object.keys(socialMedia).map((key) => (
        <InputContainer key={key}>
          <Field
            isFilledOut={!!contacts[key as SocialMedia]}
            onClick={
              isEditable ? () => handleClick(key as SocialMedia) : undefined
            }
          >
            <img
              src={`/assets/social-media/${key}.png`}
              alt={`${key} logotype`}
            />
            <p>{socialMedia[key].name}</p>
          </Field>

          {isEditable && contacts[key] && (
            <DeleteButton onClick={() => handleDelete(key)}>
              <CrossIcon src="/assets/icons/close.png" />
            </DeleteButton>
          )}
        </InputContainer>
      ))}

      {popupKey && (
        <ContactPopup
          name={popupKey}
          title={socialMedia[popupKey].name}
          defaultValue={contacts[popupKey]}
          placeholder={t(socialMedia[popupKey].placeholder)}
          closePopup={closePopup}
        />
      )}
    </Container>
  );
};

export default ContactForm;
