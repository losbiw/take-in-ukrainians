import React, { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import CitySearchBar, { Icon } from "@/components/filters/city-search";
import MetaTags from "@/components/general/meta";
import Radio from "@/components/inputs/radio";
import breakpoints from "@/constants/breakpoints";
import City from "@/types/city";
import colors from "@/constants/colors";
import { Button } from "../buttons/buttons";

interface Props {
  isResidenceOnly: boolean;
}

const FiltersIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const FiltersButton = styled.button`
  display: flex;
  align-items: center;
  color: ${colors.darkGrey};
  background: transparent;
  border: none;
  font-size: 0.95rem;
  transition: 0.2s;
  gap: 0.6rem;

  &:hover {
    cursor: pointer;
    color: ${colors.grey};
  }
`;

const Search = styled(Button)`
  display: flex;
  gap: 1rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 0.6rem;
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

const Filters: FC<Props> = ({ isResidenceOnly }) => {
  const router = useRouter();
  const { t } = useTranslation("feed");

  const [city, setCity] = useState<City>();
  const [areFiltersVisible, setAreFiltersVisible] = useState(false);

  const pushQueryToRouter = useCallback(
    (queryObj: any) => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, ...queryObj },
      });
    },
    [router]
  );

  useEffect(() => {
    if (city) {
      pushQueryToRouter({ cityId: city.city_id });
    }
  }, [city]);

  return (
    <>
      <MetaTags
        title={`${isResidenceOnly ? t("residences") : t("refugees")} ${
          city ? ` ${t("in")} ${city.city_name}` : ""
        } | Take in Ukrainians`}
      />

      <Container>
        <InnerContainer>
          <FiltersButton
            onClick={() => setAreFiltersVisible(!areFiltersVisible)}
          >
            <FiltersIcon src="/assets/icons/filter.png" />
            {t("filters")}
          </FiltersButton>

          <CitySearchBar setCity={setCity} />

          <Search>
            {t("search")} <Icon src="/assets/icons/search.png" />
          </Search>
        </InnerContainer>

        {areFiltersVisible && (
          <RadioContainer>
            <StyledRadio
              onClick={() => pushQueryToRouter({ offersOnly: true })}
              type="button"
              isActive={isResidenceOnly}
            >
              {t("residences")}
            </StyledRadio>

            <StyledRadio
              onClick={() => pushQueryToRouter({ offersOnly: false })}
              type="button"
              isActive={!isResidenceOnly}
            >
              {t("refugees")}
            </StyledRadio>
          </RadioContainer>
        )}
      </Container>
    </>
  );
};

export default Filters;
