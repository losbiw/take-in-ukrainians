/* global google */
import useTranslation from "next-translate/useTranslation";
import Script from "next/script";
import React, { FC, useState } from "react";
import styled from "styled-components";
import colors from "@/constants/colors";
import Input, { InputStyles } from "./inputs/input";
import City from "@/types/city";

let timeout: NodeJS.Timeout;

const StyledInput = styled(Input)<{ areCitiesFound: boolean }>`
  margin: 0;
  border-radius: ${({ areCitiesFound }) =>
    areCitiesFound ? "1.5rem 1.5rem 0 0" : ""};
  border-bottom-color: ${({ areCitiesFound }) =>
    areCitiesFound ? colors.black : colors.grey};
`;

const Container = styled.div`
  position: relative;
`;

const CityButton = styled.button`
  ${InputStyles}

  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 0;
  margin: 0;
  text-align: start;
  font-weight: 500;

  &:last-of-type {
    border-radius: 0 0 1.5rem 1.5rem;
  }
`;

const Icon = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 1.1rem;
`;

const SearchIcon = styled(Icon)`
  margin: 0;
  position: absolute;
  top: 0.9rem;
  right: 2rem;
`;

const CitySearchBar: FC = () => {
  const { t } = useTranslation();

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.AutocompleteService>();
  const [cities, setCities] = useState<City[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value && autocomplete) {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const fetchPrediction = async () => {
          const options = {
            input: value,
            types: ["(cities)"],
          };

          autocomplete.getPlacePredictions(options, (result) => {
            setCities(
              result?.map(({ description, place_id }) => ({
                name: description,
                id: place_id,
              })) || []
            );
          });
        };

        fetchPrediction();
      }, 500);
    } else {
      clearTimeout(timeout);
      setCities([]);
    }
  };

  return (
    <>
      <Script
        async
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_PLACES_KEY}&libraries=places`}
        onLoad={() =>
          setAutocomplete(new google.maps.places.AutocompleteService())
        }
      />

      <Container>
        <StyledInput
          placeholder={t("general:city_name")}
          onChange={handleChange}
          areCitiesFound={cities.length > 0}
        />

        <SearchIcon src="/assets/icons/search.png" />

        {cities.length > 0 &&
          cities.map((city) => (
            <CityButton key={city.name}>
              <Icon src="/assets/icons/geolocation.png" />
              {city.name}
            </CityButton>
          ))}
      </Container>
    </>
  );
};

export default CitySearchBar;
