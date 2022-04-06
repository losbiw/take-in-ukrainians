import { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import breakpoints from "@/constants/breakpoints";
import colors from "@/constants/colors";
import verifyJWT from "@/helpers/jwt";
import validateInputs, { PostErrors } from "@/helpers/validateInputs";
import renderErrors from "@/helpers/error";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: 90%;
  max-width: 1240px;
  margin: 4rem auto;

  ${breakpoints.lg} {
    grid-template-columns: 1fr 1fr;
    padding: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const MainTitle = styled.h1`
  font-size: 1.5rem;
  color: ${colors.black};
  margin: 0;
`;

const SubTitle = styled.h2`
  font-size: 1rem;
  color: ${colors.black};
  font-weight: 500;
  margin: 3rem 0 2rem;
`;

const Warning = styled.p`
  font-size: 0.9rem;
  line-height: 160%;
  color: ${colors.grey};
  margin: 1.2rem 0;
  font-weight: 400;
`;

const SharedInputStyles = `
  border: 1px ${colors.grey} solid;
  padding: 0.8rem 2rem;
  font-size: 0.9rem;
  border-radius: 2rem;
  background-color: ${colors.white};
  outline-color: ${colors.blue};
  margin-bottom: 0.5rem;

  &:placeholder {
    color: ${colors.darkGrey};
    font-weight: 500;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Input = styled.input`
  ${SharedInputStyles}
`;

const DescriptionInput = styled.textarea`
  ${SharedInputStyles}

  resize: none;
  height: 10rem;
  margin-top: 0.5rem;
  padding: 1.2rem 2rem;
`;

const ChoiceButton = styled.button<{ isActive: boolean | undefined }>`
  ${SharedInputStyles}

  text-align: center;
  color: ${({ isActive }) => (isActive ? colors.blue : "")};
  border-color: ${({ isActive }) => (isActive ? colors.blue : "")};

  &:first-of-type {
    margin-bottom: ${({ isActive }) => (!isActive ? "1rem" : 0)};
  }
`;

const Submit = styled.input`
  ${SharedInputStyles}

  color: ${colors.white};
  background-color: ${colors.blue};
  font-weight: 500;
  border: none;
  margin-top: 2.5rem;
`;

const Create: NextPage = () => {
  const { t } = useTranslation("create_post");

  const [isOfferingResidence, setIsOfferingResidence] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxPeople, setMaxPeople] = useState<number>();
  const [errors, setErrors] = useState<Partial<PostErrors>>();

  const handleChange = () => {
    const inputErrors = validateInputs.post({
      title,
      description,
      isOffering: isOfferingResidence,
      maxPeople: maxPeople || 0,
      city: "Uknown",
    });

    setErrors(inputErrors);
  };

  const handleSubmit = () => {
    handleChange();
  };

  return (
    <Container>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <MainTitle>{t("create_a_proposal")}</MainTitle>

        <SubTitle>{t("what_are_you_looking_to_do")}</SubTitle>

        <ChoiceButton
          isActive={isOfferingResidence}
          onClick={(e) => {
            e.preventDefault();
            setIsOfferingResidence(true);
          }}
        >
          {t("offer_my_residence")}
        </ChoiceButton>

        {isOfferingResidence && <Warning>{t("offer_warning")}</Warning>}

        <ChoiceButton
          isActive={!isOfferingResidence && isOfferingResidence !== undefined}
          onClick={(e) => {
            e.preventDefault();
            setIsOfferingResidence(false);
          }}
        >
          {t("find_a_place")}
        </ChoiceButton>

        <SubTitle>{t("general_info")}</SubTitle>

        <Input
          type="text"
          maxLength={50}
          placeholder={t("title")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {errors &&
          renderErrors(errors, "title", { t, namespace: "create_post" })}

        <DescriptionInput
          maxLength={300}
          placeholder={t("description")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {errors &&
          renderErrors(errors, "description", { t, namespace: "create_post" })}

        {isOfferingResidence && (
          <>
            <SubTitle>{t("how_many_people")}</SubTitle>

            <Input
              type="number"
              placeholder={t("estimated_number")}
              value={maxPeople}
              onChange={(e) => setMaxPeople(parseInt(e.target.value, 10))}
            />

            {errors &&
              renderErrors(errors, "maxPeople", {
                t,
                namespace: "create_post",
              })}
          </>
        )}

        <Submit type="submit" value={t("publish")} />
      </Form>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  verifyJWT.client(ctx);

export default Create;
