import useTranslation from "next-translate/useTranslation";
import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import colors from "@/constants/colors";
import breakpoints from "@/constants/breakpoints";
import { WhiteTitle } from "../general/title";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("/assets/landing/background.png");
  background-size: cover;
  background-position: center;
  padding: 6rem 0;

  * {
    z-index: 0;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    180deg,
    rgba(53, 55, 62, 0.5) 30.62%,
    rgba(58, 60, 70, 0.15) 80%
  );
`;

const Description = styled.p`
  color: ${colors.white};
  text-align: center;
  font-size: 1rem;
  margin: 0 0 2.5rem;
  max-width: 50%;
  line-height: 160%;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${breakpoints.md} {
    flex-direction: row;
  }
`;

const StyledLink = styled.a`
  color: white;
  padding: 0.7rem 3rem;
  margin: 0 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 999px;
`;

const BlueLink = styled(StyledLink)`
  background-color: ${colors.blue};
  box-shadow: 2px 3px 21px rgba(1, 84, 189, 0.5);
`;

const YellowLink = styled(StyledLink)`
  background-color: ${colors.yellow};
  box-shadow: 2px 3px 21px rgba(255, 210, 47, 0.4);
  text-shadow: 1px 2px 3px #ffc700;
`;

const Banner: FC = () => {
  const { t } = useTranslation("home");

  return (
    <Container>
      <Overlay />

      <WhiteTitle>{t("never_too_late")}</WhiteTitle>
      <Description>{t("during_europes_war")}</Description>

      <LinksContainer>
        <Link href="/dashboard/create?offer_type=residence">
          <BlueLink href="/dashboard/create?offer_type=residence">
            {t("offer_residence")}
          </BlueLink>
        </Link>

        <Link href="/dashboard/create?offer_type=refugee">
          <YellowLink href="/dashboard/create?offer_type=refugee">
            {t("find_a_place")}
          </YellowLink>
        </Link>
      </LinksContainer>
    </Container>
  );
};

export default Banner;
