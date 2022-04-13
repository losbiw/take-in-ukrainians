import React, { FC } from "react";
import styled from "styled-components";
import Nav from "@/components/nav/nav";

interface Props {
  isNavIncluded: boolean;
}

const Container = styled.div`
  width: 90%;
  max-width: 1280px;
  margin: 4rem auto;
`;

const Page: FC<Props> = ({ isNavIncluded, children }) => (
  <>
    {isNavIncluded && <Nav />}

    <Container>{children}</Container>
  </>
);

export default Page;
