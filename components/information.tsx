import useTranslation from "next-translate/useTranslation";
import styled from "styled-components";
import React, { FC } from "react";
import Head from "next/head";
import { Title } from "@/components/general/title";
import Description from "@/components/general/description";

interface Props {
  namespace: string;
  type?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const Information: FC<Props> = ({ namespace, type, children }) => {
  const { t } = useTranslation(namespace);
  const title = `${type ? `${type}-` : ""}title`;

  return (
    <>
      <Head>
        <title>{t(title)} | Take in Ukrainians</title>
      </Head>

      <Container>
        <Title>{t(title)}</Title>
        <Description>{t(`${type ? `${type}-` : ""}description`)}</Description>

        {children}
      </Container>
    </>
  );
};

export default Information;
