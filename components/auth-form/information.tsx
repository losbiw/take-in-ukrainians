import React, { FC } from "react";
import styled from "styled-components";
import colors from "@/constants/colors";
import { WhiteTitle } from "../general/title";

interface Props {
  title: string;
  description: string;
}

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: ${colors.yellow};
  padding: 6rem 0;

  & > * {
    z-index: 1;
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
`;

const Description = styled.p`
  text-align: center;
  color: ${colors.white};
  margin: 0;
  font-size: 1rem;
  line-height: 170%;
`;

const Information: FC<Props> = ({ title, description }) => (
  <Container>
    <TextContainer>
      <WhiteTitle>{title}</WhiteTitle>
      <Description>{description}</Description>
    </TextContainer>

    <BlueRectangle />
  </Container>
);

export default Information;
