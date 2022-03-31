import React, { FC } from "react";
import styled from "styled-components";
import colors from "@/constants/colors";

interface Props {
  title: string;
  description: string;
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: ${colors.yellow};
  background-size: cover;
  background-position: center;
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

const Title = styled.h2`
  text-align: center;
  color: ${colors.white};
  margin: 1.3rem 0;
  font-size: 1.65rem;
  font-weight: 600;
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
      <Title>{title}</Title>
      <Description>{description}</Description>
    </TextContainer>

    <BlueRectangle />
  </Container>
);

export default Information;
