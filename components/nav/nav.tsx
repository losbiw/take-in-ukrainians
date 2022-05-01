import Link from "next/link";
import React, { FC, memo, useState } from "react";
import styled from "styled-components";
import useTranslation from "next-translate/useTranslation";
import breakpoints, { sizes } from "@/constants/breakpoints";
import colors from "@/constants/colors";
import Menu from "./menu";
import useWidth from "@/hooks/useWidth";

const StyledNav = styled.nav`
  width: 100%;
  padding: 0.5rem 0;
  margin: 0 auto;
  box-shadow: 0px 6px 20px rgba(47, 47, 47, 0.05);
`;

const PaddingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  max-width: 1280px;
  margin: 0 auto;

  & > a {
    display: none;
  }

  ${breakpoints.md} {
    & > a {
      display: block;
    }
  }
`;

const Logo = styled.a`
  font-size: 1.2rem;
  margin: 0 1rem 0 0;
  font-weight: 600;
  color: ${colors.blue};
`;

const Yellow = styled.span`
  color: ${colors.yellow};
`;

const DonateLink = styled.a`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${colors.blue} !important;
  display: block;
  padding: 0.25rem 2rem;
  border-radius: 999px;
  border: 2px solid ${colors.blue};
  transition: 0.3s;

  &:hover {
    color: ${colors.white} !important;
    background-color: ${colors.blue};
  }

  ${breakpoints.md} {
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
    margin-bottom: 5px;
  }

  ${({ isMenuExpanded }) =>
    isMenuExpanded
      ? `
    &:before {
      transform: translateY(7px) rotate(135deg);
    }

    &:after {
      transform: translateY(-7px) rotate(-135deg);
    }

    div {
      transform: scale(0);
    }
  `
      : ""}

  ${breakpoints.md} {
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
      <PaddingContainer>
        <div>
          <Link href="/">
            <Logo href="/">
              Take in <Yellow>Ukrainians</Yellow>
            </Logo>
          </Link>
        </div>

        <MenuButton
          isMenuExpanded={isMenuExpanded}
          onClick={() => setIsMenuExpanded(!isMenuExpanded)}
        >
          <div />
        </MenuButton>

        {(isMenuExpanded || (windowWidth && windowWidth >= sizes.lg)) && (
          <Menu closeMenu={() => setIsMenuExpanded(false)} links={links}>
            <Donate />
          </Menu>
        )}

        <Donate />
      </PaddingContainer>
    </StyledNav>
  );
};

export default Nav;
