import React, { FC } from "react";
import styled from "styled-components";
import breakpoints from "@/constants/breakpoints";

const SplitContainer = styled.div`
  width: 100%;
  display: flex;

  ${breakpoints.lg} {
    & > * {
      width: 50%;
    }
  }
`;

const SplitScreen: FC = ({ children }) => (
  <SplitContainer>{children}</SplitContainer>
);

export default SplitScreen;
