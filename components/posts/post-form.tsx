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

interface Props {
  post?: Post;
}

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

const PostForm: FC<Props> = ({ post }) => {
  const { t } = useTranslation("create_post");
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

      router.push(`/feed/${json.postId}`);
    } else {
      const json = await res.json();

      const errorsCopy = { ...errors };
      errorsCopy.server = {};

      errorsCopy.server[json.message] = true;

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

          <Subtitle>{t("location")}</Subtitle>
          <CitySearchBar setCity={setCity} defaultValue={post?.city_name} />

          {errors &&
            renderErrors(errors, "city_id", {
              t,
              namespace: "create_post",
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
              namespace: "create_post",
            })}

          <Submit type="submit" value={t("publish")} />
        </Form>
      </Container>
    </Page>
  );
};

export default PostForm;
