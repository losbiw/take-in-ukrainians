import React, { FC } from "react";
import styled from "styled-components";
import breakpoints from "@/constants/breakpoints";

const SplitContainer = styled.div`
  display: flex;

  & > * {
    width: 100%;
  }

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
