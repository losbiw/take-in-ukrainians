import Link from "next/link";
import React, { FC, memo, useState } from "react";
import styled from "styled-components";
import useTranslation from "next-translate/useTranslation";
import breakpoints, { sizes } from "@/constants/breakpoints";
import colors from "@/constants/colors";
import Menu from "./menu";
import useWidth from "@/hooks/useWidth";

const StyledNav = styled.nav`
  width: 90%;
  max-width: 1280px;
  margin: 0.5rem auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > a {
    display: none;
  }

  ${breakpoints.lg} {
    & > a {
      display: block;
    }
  }
`;

const TitleLink = styled.a`
  font-size: 1.2rem;
  margin: 0 1rem 0 0;
  font-weight: 600;
  color: ${colors.blue};
`;

const Yellow = styled.span`
  color: ${colors.yellow};
`;

const DonateLink = styled.a`
  font-weight: 500;
  color: ${colors.blue} !important;
  display: block;
  padding: 0.35rem 2rem;
  border-radius: 999px;
  border: 1px solid ${colors.blue};
  transition: 0.3s;

  &:hover {
    color: ${colors.white} !important;
    background-color: ${colors.blue};
  }

  ${breakpoints.lg} {
    display: none;
  }
`;

const MenuButton = styled.div<{ isMenuExpanded: boolean }>`
  width: 23px;
  border: none;
  background: transparent;
  z-index: 999;

  &:after,
  &:before,
  & div {
    background-color: ${colors.black};
    border-radius: 999px;
    content: "";
    display: block;
    height: 2px;
    transition: all 0.2s ease-in-out;
  }

  &:before,
  & div {
    margin-bottom: 6px;
  }

  ${({ isMenuExpanded }) =>
    isMenuExpanded
      ? `
    &:before {
      transform: translateY(8px) rotate(135deg);
    }

    &:after {
      transform: translateY(-8px) rotate(-135deg);
    }

    div {
      transform: scale(0);
    }
  `
      : ""}

  ${breakpoints.lg} {
    display: none;
  }
`;

const links = [
  {
    placeholder: "find_residence",
    href: "/feed/1?offersOnly=true",
  },
  {
    placeholder: "find_refugees",
    href: "/feed/1?offersOnly=false",
  },
  {
    placeholder: "dashboard",
    href: "/dashboard",
  },
];

const Nav: FC = () => {
  const { t } = useTranslation("general");
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const windowWidth = useWidth();

  const Donate = memo(() => (
    <DonateLink target="_blank" href="https://standforukraine.com/">
      {t("donate")}
    </DonateLink>
  ));

  return (
    <StyledNav>
      <div>
        <Link href="/">
          <TitleLink href="/">
            Take in <Yellow>Ukrainians</Yellow>
          </TitleLink>
        </Link>
      </div>

      <MenuButton
        isMenuExpanded={isMenuExpanded}
        onClick={() => setIsMenuExpanded(!isMenuExpanded)}
      >
        <div />
      </MenuButton>

      {(isMenuExpanded || (windowWidth && windowWidth >= sizes.lg)) && (
        <Menu links={links}>
          <Donate />
        </Menu>
      )}

      <Donate />
    </StyledNav>
  );
};

export default Nav;
