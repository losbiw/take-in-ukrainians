import React, { FC } from "react";
import styled from "styled-components";

const SplitContainer = styled.div`
  width: 100%;
  display: flex;

  & > * {
    width: 50%;
    height: 100vh;
  }
`;

const SplitScreen: FC = ({ children }) => (
  <SplitContainer>{children}</SplitContainer>
);

export default SplitScreen;
