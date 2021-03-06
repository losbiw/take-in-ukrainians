import styled from "styled-components";
import colors from "@/constants/colors";
import { InputStyles } from "./input";

const Submit = styled.input`
  ${InputStyles}

  color: ${colors.white};
  background-color: ${colors.blue};
  font-weight: 500;
  border: none;
  margin-top: 2.5rem;

  &:hover {
    transform: scale(1.03);
    cursor: pointer;
  }
`;

export default Submit;
