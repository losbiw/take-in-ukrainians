import styled from "styled-components";
import colors from "@/constants/colors";

export const Title = styled.h1`
  color: ${colors.black};
  margin: 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const WhiteTitle = styled(Title)`
  color: ${colors.white};
`;
