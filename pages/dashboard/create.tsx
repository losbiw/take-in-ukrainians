import { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import { useRouter } from "next/router";
import breakpoints from "@/constants/breakpoints";
import colors from "@/constants/colors";
import verifyJWT from "@/helpers/jwt";
import validateInputs, { PostErrors } from "@/helpers/validateInputs";
import renderErrors from "@/helpers/error";
import Page from "@/components/general/page";
import Subtitle from "@/components/general/subtitle";
import { Title } from "@/components/general/title";
import Input, { InputStyles } from "@/components/inputs/input";
import Submit from "@/components/inputs/submit";

interface Errors extends PostErrors {
  server: {
    [key: string]: boolean;
  };
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
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

const Warning = styled.p`
  font-size: 0.9rem;
  line-height: 160%;
  color: ${colors.grey};
  margin: 0.8rem 0;
  font-weight: 400;
`;

const DescriptionInput = styled.textarea`
  ${InputStyles}

  resize: none;
  height: 10rem;
  padding: 1.2rem 2rem;
  border-radius: 2rem;
`;

const ChoiceButton = styled.button<{ isActive: boolean | undefined }>`
  ${InputStyles}

  text-align: center;
  color: ${({ isActive }) => (isActive ? colors.blue : "")};
  border-color: ${({ isActive }) => (isActive ? colors.blue : "")};
`;

const getQueryBasedState = (offerType: string | string[] | undefined) =>
  !!(offerType && offerType === "residence");

const Create: NextPage = () => {
  const { t } = useTranslation("create_post");
  const router = useRouter();

  const [isOfferingResidence, setIsOfferingResidence] = useState(
    getQueryBasedState(router.query.offer_type)
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxPeople, setMaxPeople] = useState<number>();
  const [errors, setErrors] = useState<Partial<Errors>>();

  // eslint-disable-next-line consistent-return
  const handleSubmit = async () => {
    const requestData = {
      title,
      description,
      is_offering: isOfferingResidence,
      max_people: maxPeople || 0,
      city: "Uknown",
    };

    const [areErrors, inputErrors] = validateInputs.post(requestData);

    if (areErrors) return setErrors(inputErrors);

    const res = await fetch(`/api/post/`, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const json = await res.json();

      router.push(`/feed?post_id=${json.post_id}`);
    } else {
      const json = await res.json();

      const errorsCopy = { ...errors };
      errorsCopy.server = {};

      errorsCopy.server[json.key] = true;

      setErrors(errorsCopy);
    }
  };

  return (
    <Page isNavIncluded={false}>
      <Container>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Title>{t("create_a_proposal")}</Title>

          <Subtitle>{t("what_are_you_looking_to_do")}</Subtitle>

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

          <Subtitle>{t("general_info")}</Subtitle>

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
            renderErrors(errors, "description", {
              t,
              namespace: "create_post",
            })}

          {isOfferingResidence && (
            <>
              <Subtitle>{t("how_many_people")}</Subtitle>

              <Input
                type="number"
                placeholder={t("estimated_number")}
                value={maxPeople || ""}
                onChange={(e) => setMaxPeople(parseInt(e.target.value, 10))}
              />

              {errors &&
                renderErrors(errors, "max_people", {
                  t,
                  namespace: "create_post",
                })}
            </>
          )}

          <Submit type="submit" value={t("publish")} />
        </Form>
      </Container>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  verifyJWT.client(ctx);

export default Create;
