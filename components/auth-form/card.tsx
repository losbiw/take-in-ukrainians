import React, { FC, MemoExoticComponent } from "react";
import styled from "styled-components";
import colors from "@/constants/colors";
import Subtitle from "../general/subtitle";

export interface CardProps {
  images: string[];
  title: string;
  Description: MemoExoticComponent<() => JSX.Element>;
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem 2rem 4.5rem;
  position: relative;
  background-color: ${colors.white};
  border-radius: 1rem;
  width: 19rem;
  max-width: 80%;
  z-index: 2;

  * {
    text-align: start !important;
  }

  p {
    margin: 0;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: white;
  box-shadow: 0px 0px 30px rgba(4, 55, 120, 0.1);
  border-radius: 50%;
  z-index: 2;

  &:first-child {
    top: -2rem;
    right: -3rem;
    width: 7vw;
    height: 7vw;
  }

  &:nth-child(2) {
    top: 50%;
    right: 95%;
    width: 8vw;
    height: 8vw;
    z-index: 0;
  }

  &:nth-child(3) {
    bottom: -2rem;
    right: -5rem;
    width: 11vw;
    height: 11vw;
  }
`;

const Image = styled.img`
  width: 60%;
  max-height: 60%;
`;

const Card: FC<CardProps> = ({ images, title, Description }) => (
  <CardContainer>
    {images.map((image) => (
      <ImageContainer key={image}>
        <Image src={image} />
      </ImageContainer>
    ))}

    <Subtitle>{title}</Subtitle>
    <Description />
  </CardContainer>
);

export default Card;
