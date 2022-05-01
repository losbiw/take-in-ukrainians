import styled from "styled-components";
import colors from "@/constants/colors";

const Description = styled.p`
  font-size: 1rem;
  line-height: 160%;
  color: ${colors.darkGrey};
  margin: 1.5rem 0;
  font-weight: 400;
`;

export const WhiteDescription = styled(Description)`
  color: ${colors.white};
`;

export default Description;
