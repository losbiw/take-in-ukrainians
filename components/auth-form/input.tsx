import styled from "styled-components";
import colors from "@/constants/colors";

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1.8rem;
  margin: 0.6rem 0;
  color: ${colors.black};
  border: 1px solid ${colors.grey};
  border-radius: 999px;
  font-size: 0.9rem;

  &:placeholder {
    color: ${colors.darkGrey};
  }
`;

export default Input;
