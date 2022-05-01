import styled from "styled-components";
import colors from "@/constants/colors";

const AlternateAuth = styled.a`
  font-size: 0.9rem;
  color: ${colors.grey};
  margin: 1.2rem 0 0;
  transition: 0.1s;
  display: inline-block;

  &:hover {
    color: ${colors.darkGrey};
  }

  & .highlited {
    color: ${colors.blue};
    text-decoration: underline;
  }
`;

export default AlternateAuth;
