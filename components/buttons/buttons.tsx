import styled from "styled-components";
import breakpoints from "@/constants/breakpoints";
import colors from "@/constants/colors";
import { InputStyles } from "../inputs/input";

const SharedStyles = `
  ${InputStyles}

  display: block;
  font-weight: 500;
  margin: 0.8rem 0;
  text-align: center;
  transition: .2s;

  &:hover {
    cursor: pointer;
    transform: scale(1.03);
  }

  // ${breakpoints.md} {
  //   width: 50%;
  // }

  // ${breakpoints.lg} {
  //   width: 35%;
  // }
`;

export const Button = styled.a`
  ${SharedStyles}

  color: ${colors.white};
  border: none;
  background-color: ${colors.blue};
`;

export const DangerousButton = styled.a`
  ${SharedStyles}

  color: ${colors.red};
  background-color: ${colors.white};
  border: 1px solid ${colors.red};

  &:hover {
    background-color: ${colors.red};
    color: ${colors.white};
  }
`;
