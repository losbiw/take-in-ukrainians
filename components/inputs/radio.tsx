import styled from "styled-components";
import colors from "@/constants/colors";
import { InputStyles } from "./input";

const Radio = styled.button<{ isActive: boolean | undefined }>`
  ${InputStyles}

  text-align: center;
  border-color: ${({ isActive }) => (isActive ? colors.blue : "")};
  ${({ isActive }) => (isActive ? `color: ${colors.blue};` : "")};

  &:hover {
    cursor: ${({ isActive }) => (isActive ? "auto" : "pointer")};
    ${({ isActive }) => (!isActive ? `color: ${colors.grey};` : "")};
  }
`;

export default Radio;
