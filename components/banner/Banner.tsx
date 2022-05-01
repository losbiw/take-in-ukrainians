import useTranslation from "next-translate/useTranslation";
import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import colors from "@/constants/colors";
import breakpoints from "@/constants/breakpoints";
import { WhiteTitle } from "../general/title";
import { WhiteDescription } from "../general/description";
import { Button } from "../buttons/buttons";
import Overlay from "../general/overlay";

type Color = "blue" | "yellow";

interface LinkInterface {
  href: string;
  title: string;
  color: Color;
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("/assets/landing/background.png");
  background-size: cover;
  background-position: center;
  padding: 12rem 0;

  * {
    z-index: 1;
  }

  ${breakpoints.md} {
    padding: 5rem 0 6rem;
  }
`;

const Fade = styled(Overlay)`
  position: absolute;

  background: linear-gradient(
    180deg,
    rgba(53, 55, 62, 0.5) 30.62%,
    rgba(58, 60, 70, 0.15) 80%
  );
`;

const StyledDescription = styled(WhiteDescription)`
  margin-top: 0.5rem;
  max-width: 90%;
  text-align: center;

  ${breakpoints.lg} {
    max-width: 50%;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  ${breakpoints.md} {
    gap: 1rem;
    flex-direction: row;
  }
`;

const StyledLink = styled(Button)<{ color: Color }>`
  ${({ color }) =>
    color === "blue"
      ? `background-color: ${colors.blue};
  box-shadow: 2px 3px 21px rgba(1, 84, 189, 0.5);`
      : `background-color: ${colors.yellow};
  box-shadow: 2px 3px 21px rgba(255, 210, 47, 0.4);
  text-shadow: 1px 2px 3px #ffc700;`}

  &:hover {
    transform: scale(1.05);
  }
`;

const links: LinkInterface[] = [
  {
    title: "offer_residence",
    href: "/dashboard/create?offerType=residence",
    color: "blue",
  },
  {
    title: "find_a_place",
    href: "/feed/1?offersOnly=true",
    color: "yellow",
  },
];

const Banner: FC = () => {
  const { t } = useTranslation("home");

  return (
    <Container>
      <Fade />

      <WhiteTitle>{t("never_too_late")}</WhiteTitle>
      <StyledDescription>{t("during_europes_war")}</StyledDescription>

      <LinksContainer>
        {links.map(({ title, href, color }) => (
          <Link key={title} href={href}>
            <StyledLink href={href} color={color}>
              {t(title)}
            </StyledLink>
          </Link>
        ))}
      </LinksContainer>
    </Container>
  );
};

export default Banner;
