import React, { FC } from "react";
import styled from "styled-components";
import Nav from "@/components/nav/nav";

interface Props {
  isNavIncluded: boolean;
}

const PageContainer = styled.div`
  min-height: 100vh;
`;

const OuterWrapper = styled.div`
  width: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
  max-width: 1280px;
  margin: 4rem auto;
  height: 100%;
`;

const Page: FC<Props> = ({ isNavIncluded, children }) => (
  <PageContainer>
    {isNavIncluded && <Nav />}

    <ContentWrapper>
      <OuterWrapper>{children}</OuterWrapper>
    </ContentWrapper>
  </PageContainer>
);

export default Page;
