import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import React from "react";
import { Title } from "@/components/general/title";
import Description from "@/components/general/description";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const ConfirmEmail: NextPage = () => {
  const { t } = useTranslation("confirmation-letter");

  return (
    <Container>
      <Title>{t("confirm email")}</Title>
      <Description>{t("we sent the confirmation link")}</Description>
    </Container>
  );
};

export default ConfirmEmail;
