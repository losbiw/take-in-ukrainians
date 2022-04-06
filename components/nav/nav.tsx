import Link from "next/link";
import React, { FC, memo } from "react";
import styled from "styled-components";
import useTranslation from "next-translate/useTranslation";
import breakpoints from "@/constants/breakpoints";
import colors from "@/constants/colors";

const StyledNav = styled.nav`
  width: 90%;
  max-width: 1240px;
  margin: 0.5rem auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > a {
    display: none;
  }

  ${breakpoints.md} {
    & > a {
      display: block;
    }
  }
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin: 0 1rem 0 0;
  color: ${colors.blue};
`;

const Yellow = styled.span`
  color: ${colors.yellow};
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  a {
    margin: 0.3rem 0;
    color: ${colors.black};
    transition: 0.15s;
    font-size: 0.9rem;

    &:hover {
      color: ${colors.grey};
    }
  }

  ${breakpoints.md} {
    position: relative;
    flex-direction: row;

    a {
      margin: 0 2rem;
    }
  }
`;

const DonateLink = styled.a`
  font-weight: 500;
  color: ${colors.white} !important;
  background-color: ${colors.blue};
  display: block;
  padding: 0.4rem 2rem;
  border-radius: 999px;

  ${breakpoints.md} {
    display: none;
  }
`;

const links = [
  {
    placeholder: "find_residence",
    href: "/feed?residence_only=true",
  },
  {
    placeholder: "find_refugees",
    href: "/feed?residence_only=false",
  },
  {
    placeholder: "dashboard",
    href: "/dashboard",
  },
];

const Nav: FC = () => {
  const { t } = useTranslation("general");

  const Donate = memo(() => (
    <DonateLink target="_blank" href="https://standforukraine.com/">
      {t("donate")}
    </DonateLink>
  ));

  return (
    <StyledNav>
      <Title>
        Take in <Yellow>Ukrainians</Yellow>
      </Title>

      <Menu>
        {links.map(({ placeholder, href }) => (
          <Link href={href} key={href}>
            <a href={href}>{t(placeholder)}</a>
          </Link>
        ))}

        <Donate />
      </Menu>

      <Donate />
    </StyledNav>
  );
};

export default Nav;
