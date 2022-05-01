import React, { FC } from "react";
import styled from "styled-components";
import colors from "@/constants/colors";
import { WhiteTitle } from "../general/title";
import Bubbles, { CardProps } from "./bubbles";
import breakpoints from "@/constants/breakpoints";

interface Props {
  title: string;
  description: string;
  bubblesData: CardProps;
}

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${colors.yellow};
  padding: 6rem 0;

  & > * {
    z-index: 1;
  }

  ${breakpoints.lg} {
    display: flex;
  }
`;

const BlueRectangle = styled.div`
  width: 100%;
  height: 150%;
  transform: rotate(45deg);
  background: ${colors.blue};
  position: absolute;
  top: -25%;
  z-index: 0;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-top: 3rem;
`;

const Description = styled.p`
  text-align: center;
  color: ${colors.white};
  margin: 0;
  font-size: 1rem;
  line-height: 170%;
`;

const Information: FC<Props> = ({
  title,
  description,
  bubblesData: innerCardInfo,
}) => (
  <Container>
    <Bubbles {...innerCardInfo} />

    <TextContainer>
      <WhiteTitle>{title}</WhiteTitle>
      <Description>{description}</Description>
    </TextContainer>

    <BlueRectangle />
  </Container>
);

export default Information;
