import React, { FC } from "react";
import styled from "styled-components";
import useTranslation from "next-translate/useTranslation";
import CitySearchBar from "@/components/city-search";
import Radio from "@/components/inputs/radio";
import breakpoints from "@/constants/breakpoints";
import City from "@/types/city";

// interface Radio {

// }

interface Props {
  // eslint-disable-next-line no-unused-vars
  setCity: (city: City) => void;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;

  ${breakpoints.sm} {
    gap: 1.5rem;
    flex-direction: row;
    margin-bottom: 0;
  }
`;

const RadioContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StyledRadio = styled(Radio)`
  width: auto;
  font-weight: 500;
`;

const Filters: FC<Props> = ({ setCity }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <CitySearchBar setCity={setCity} />

      <RadioContainer>
        <StyledRadio
          onClick={() => pushOfferFilterToQuery(true)}
          type="button"
          isActive={isResidenceOnly}
        >
          {t("residences")}
        </StyledRadio>

        <StyledRadio
          onClick={() => pushOfferFilterToQuery(false)}
          type="button"
          isActive={offersOnly === "false"}
        >
          {t("refugees")}
        </StyledRadio>
      </RadioContainer>
    </Container>
  );
};

export default Filters;
