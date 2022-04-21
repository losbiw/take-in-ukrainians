import React, { FC, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import { useRouter } from "next/router";
import breakpoints from "@/constants/breakpoints";
import colors from "@/constants/colors";
import validateInputs, { PostErrors } from "@/helpers/validateInputs";
import renderErrors from "@/helpers/renderErrors";
import Page from "@/components/general/page";
import Subtitle from "@/components/general/subtitle";
import { Title } from "@/components/general/title";
import Input, { InputStyles } from "@/components/inputs/input";
import Submit from "@/components/inputs/submit";
import CitySearchBar from "@/components/city-search-bar";
import City from "@/types/city";
import Post from "@/types/post";
import ContactForm, { ContactData } from "./contact-form";
import Radio from "../inputs/radio";

interface Props {
  post?: Post;
  contacts: ContactData;
}

interface Errors extends PostErrors {
  server: {
    [key: string]: boolean;
  };
}

const CharacterLimitationWrapper = styled.div`
  position: relative;
`;

const CharacterLimitation = styled.p<{ isInTextarea?: boolean }>`
  margin: 0;
  position: absolute;
  ${({ isInTextarea }) =>
    isInTextarea
      ? "bottom: 2.5rem;"
      : "top: 50%; transform: translate(0, -50%);"}
  right: 2rem;
  font-size: 0.9rem;
  color: ${colors.grey};
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin: 1rem auto;
  gap: 3rem;

  ${breakpoints.lg} {
    gap: 8rem;
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

const getQueryBasedState = (offerType: string | string[] | undefined) =>
  !!(offerType && offerType === "residence");

const PostForm: FC<Props> = ({ post, contacts }) => {
  const { t } = useTranslation("create-post");
  const router = useRouter();

  const [isOfferingResidence, setIsOfferingResidence] = useState(
    post?.is_offering || getQueryBasedState(router.query.offerType)
  );
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");

  const [peopleNumber, setPeopleNumber] = useState<number | undefined>(
    post?.people_number || undefined
  );

  const [city, setCity] = useState<City | undefined>(
    post?.city_id && post?.city_name
      ? {
          city_id: post?.city_id,
          city_name: post?.city_name,
        }
      : undefined
  );
  const [errors, setErrors] = useState<Partial<Errors>>();

  // eslint-disable-next-line consistent-return
  const handleSubmit = async () => {
    const requestData: any = {
      title,
      description,
      is_offering: isOfferingResidence,
      people_number: peopleNumber || 0,
      city_name: city?.city_name || "",
      city_id: city?.city_id || "",
    };

    const [areErrors, inputErrors] = validateInputs.post(requestData);

    if (areErrors) return setErrors(inputErrors);

    if (post?.post_id) {
      requestData.post_id = post.post_id;
    }

    const res = await fetch(`/api/post/`, {
      method: post ? "PATCH" : "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const json = await res.json();

      router.push(`/post/${json.postId}`);
    } else {
      const json = await res.json();

      const errorsCopy = {
        ...errors,
        server: {
          [json.message]: true,
        },
      };

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
          <Title>{t(post ? "edit_a_proposal" : "create_a_proposal")}</Title>

          <Subtitle>{t("what_are_you_looking_to_do")}</Subtitle>

          <Radio
            isActive={isOfferingResidence}
            onClick={(e) => {
              e.preventDefault();
              setIsOfferingResidence(true);
            }}
          >
            {t("offer_my_residence")}
          </Radio>

          {isOfferingResidence && <Warning>{t("offer_warning")}</Warning>}

          <Radio
            isActive={!isOfferingResidence && isOfferingResidence !== undefined}
            onClick={(e) => {
              e.preventDefault();
              setIsOfferingResidence(false);
            }}
          >
            {t("find_a_place")}
          </Radio>

          <Subtitle>{t("general_info")}</Subtitle>

          <CharacterLimitationWrapper>
            <Input
              type="text"
              maxLength={50}
              placeholder={t("title")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <CharacterLimitation>{50 - title.length}/50</CharacterLimitation>
          </CharacterLimitationWrapper>

          {errors &&
            renderErrors(errors, "title", { t, namespace: "create-post" })}

          <CharacterLimitationWrapper>
            <DescriptionInput
              maxLength={300}
              placeholder={t("description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <CharacterLimitation isInTextarea>
              {300 - description.length}/300
            </CharacterLimitation>
          </CharacterLimitationWrapper>

          {errors &&
            renderErrors(errors, "description", {
              t,
              namespace: "create-post",
            })}

          <Subtitle>{t("location")}</Subtitle>
          <CitySearchBar setCity={setCity} defaultValue={post?.city_name} />

          {errors &&
            renderErrors(errors, "city_name", {
              t,
              namespace: "create-post",
            })}

          {errors &&
            renderErrors(errors, "city_id", {
              t,
              namespace: "create-post",
            })}

          <Subtitle>
            {isOfferingResidence ? t("max_people") : t("how_many_people")}
          </Subtitle>

          <Input
            type="number"
            placeholder={t("estimated_number")}
            value={peopleNumber || ""}
            onChange={(e) => setPeopleNumber(parseInt(e.target.value, 10))}
          />

          {errors &&
            renderErrors(errors, "people_number", {
              t,
              namespace: "create-post",
            })}

          {errors &&
            renderErrors(errors, "server", {
              t,
              namespace: "create-post",
            })}

          <Submit type="submit" value={t("publish")} />
        </Form>

        <ContactForm contacts={contacts} isEditable />
      </Container>
    </Page>
  );
};

export default PostForm;
