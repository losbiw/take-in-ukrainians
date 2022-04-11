import styled from "styled-components";
import colors from "@/constants/colors";

export const InputStyles = `
  width: 100%;
  padding: 0.8rem 1.8rem;
  margin: 0.6rem 0;
  background-color: ${colors.white};
  color: ${colors.black};
  border: 1px solid ${colors.grey};
  outline-color: ${colors.blue};
  border-radius: 999px;
  font-size: 0.9rem;

  &:placeholder {
    color: ${colors.darkGrey};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Input = styled.input`
  ${InputStyles}
`;

export default Input;
