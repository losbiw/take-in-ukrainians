import React, { FC } from "react";
import styled from "styled-components";
import breakpoints from "@/constants/breakpoints";

const Container = styled.div`
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

const SplitContainer: FC = ({ children }) => <Container>{children}</Container>;

export default SplitContainer;
