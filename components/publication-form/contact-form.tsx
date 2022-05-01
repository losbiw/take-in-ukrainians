/* eslint-disable react/destructuring-assignment */
import useTranslation from "next-translate/useTranslation";
import React, { FC, useState } from "react";
import styled from "styled-components";
import contactMethods from "@/constants/contacts";
import { InputStyles } from "../inputs/input";
import { Title } from "../general/title";
import Subtitle from "../general/subtitle";
import colors from "@/constants/colors";
import ContactPopup from "./contact-popup";
import server from "@/constants/server";
import { ContactData, ContactMethod } from "@/types/contacts";

interface Props {
  contacts: ContactData;
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

const Field = styled.a<{ isFilledOut: boolean }>`
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

  const [popupKey, setPopupKey] = useState<ContactMethod | null>(null);
  const [contacts, setContants] = useState(contactsProps);

  const updateContactsKey = (key: ContactMethod, value: string) => {
    const copy = {
      ...contactsProps,
      [key]: value,
    };

    setContants(copy);
  };

  const handleClick = (key: ContactMethod) => {
    setPopupKey(key);
  };

  const closePopup = (value?: string) => {
    if (value) {
      updateContactsKey(popupKey as ContactMethod, value);
    }

    setPopupKey(null);
  };

  const handleDelete = async (key: ContactMethod) => {
    const res = await fetch(`${server}/api/user/contact`, {
      method: "DELETE",
      body: JSON.stringify({
        [key]: null,
      }),
    });

    if (res.ok) {
      updateContactsKey(key, "");
    }
  };

  return (
    <Container>
      <Title>{t("contact information")}</Title>

      <Subtitle>
        {t(
          isEditable
            ? "only fill out ones that you want"
            : "choose whichever option"
        )}
      </Subtitle>

      {Object.keys(contactMethods).map((key) => {
        const nameKey = key as ContactMethod;
        const fieldValue = contacts[nameKey];
        const { name, baseUrl } = contactMethods[nameKey];

        if (isEditable || fieldValue) {
          return (
            <InputContainer key={key}>
              <Field
                href={
                  baseUrl +
                  (nameKey === "telegram" && fieldValue?.[0] === "@"
                    ? fieldValue.slice(1)
                    : fieldValue)
                }
                isFilledOut={!!fieldValue}
                onClick={
                  isEditable
                    ? (e) => {
                        e.preventDefault();
                        handleClick(nameKey);
                      }
                    : undefined
                }
              >
                <img
                  src={`/assets/social-media/${key}.png`}
                  alt={`${key} logotype`}
                />
                <p>{name}</p>
              </Field>

              {isEditable && fieldValue && (
                <DeleteButton
                  onClick={() => handleDelete(nameKey)}
                  type="button"
                >
                  <CrossIcon src="/assets/icons/close.png" />
                </DeleteButton>
              )}
            </InputContainer>
          );
        }

        return undefined;
      })}

      {popupKey && (
        <ContactPopup
          name={popupKey}
          title={contactMethods[popupKey].name}
          defaultValue={contacts[popupKey]}
          placeholder={t(contactMethods[popupKey].placeholder)}
          closePopup={closePopup}
        />
      )}
    </Container>
  );
};

export default ContactForm;
