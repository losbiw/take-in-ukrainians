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
import Input from "../inputs/input";

interface Props {
  isResidenceOnly: boolean;
}

const FiltersIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const FiltersButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  color: ${colors.darkGrey};
  background: transparent;
  border: none;
  font-size: 0.95rem;
  transition: 0.2s;
  gap: 0.6rem;
  margin: 1.25rem 0;

  ${({ isActive }) =>
    isActive
      ? `text-decoration: underline; color: ${colors.grey}`
      : `color: ${colors.darkGrey}`};

  span {
    display: none;
  }

  &:hover {
    cursor: pointer;
    color: ${colors.grey};
  }

  ${breakpoints.md} {
    span {
      display: block;
    }
  }
`;

const Search = styled(Button)`
  display: flex;
  gap: 1rem;
  margin: 0.6rem 0;

  span {
    display: none;
  }

  ${breakpoints.md} {
    span {
      display: block;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  gap: 0.6rem;

  ${breakpoints.sm} {
    gap: 1.5rem;
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
  const [peopleNumber, setPeopleNumber] = useState(0);

  const pushObjectToQuery = useCallback(
    (queryObj: any, page?: number) => {
      router.push({
        pathname: router.pathname,
        query: {
          ...queryObj,
          page: page || router.query.page,
        },
      });
    },
    [router]
  );

  useEffect(() => {
    if (city) {
      pushObjectToQuery({
        ...router.query,
        cityId: city.city_id,
      });
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
            isActive={areFiltersVisible}
            onClick={() => setAreFiltersVisible(!areFiltersVisible)}
          >
            <FiltersIcon src="/assets/icons/filter.png" />
            <span>{t("filters")}</span>
          </FiltersButton>

          <CitySearchBar setCity={setCity} />

          <Search
            onClick={() => {
              const data: any = {
                ...router.query,
              };

              if (!city?.city_id) delete data.cityId;

              if (peopleNumber) data.peopleNumber = peopleNumber;
              else delete data.peopleNumber;

              pushObjectToQuery(data);
            }}
          >
            <span>{t("search")}</span> <Icon src="/assets/icons/search.png" />
          </Search>
        </InnerContainer>

        {areFiltersVisible && (
          <>
            <RadioContainer>
              <StyledRadio
                onClick={() =>
                  pushObjectToQuery(
                    {
                      ...router.query,
                      offersOnly: true,
                    },
                    1
                  )
                }
                type="button"
                isActive={isResidenceOnly}
              >
                {t("residences")}
              </StyledRadio>

              <StyledRadio
                onClick={() =>
                  pushObjectToQuery(
                    {
                      ...router.query,
                      offersOnly: false,
                    },
                    1
                  )
                }
                type="button"
                isActive={!isResidenceOnly}
              >
                {t("refugees")}
              </StyledRadio>
            </RadioContainer>

            <Input
              type="number"
              placeholder={t(
                `post:${isResidenceOnly ? "max_people" : "people_number"}`
              )}
              onChange={(e) => setPeopleNumber(parseInt(e.target.value, 10))}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default Filters;
