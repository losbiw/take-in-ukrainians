import useTranslation from "next-translate/useTranslation";
import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import colors from "@/constants/colors";
import breakpoints from "@/constants/breakpoints";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("/assets/landing/background.png");
  background-size: cover;
  background-position: center;
  padding: 6rem 0;
`;

const Title = styled.h1`
  color: ${colors.white};
  font-size: 1.6rem;
  margin: 0 0 0.7rem;
`;

const Description = styled.p`
  color: ${colors.white};
  text-align: center;
  font-size: 1rem;
  margin: 0.5rem 0 3rem;
  max-width: 40%;
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
      <Title>{t("never_too_late")}</Title>
      <Description>{t("during_europes_war")}</Description>

      <LinksContainer>
        <Link href="/dashboard/create/offer">
          <BlueLink href="/dashboard/create/offer">
            {t("offer_residence")}
          </BlueLink>
        </Link>

        <Link href="/dashboard/create/refugee">
          <YellowLink href="/dashboard/create/refugee">
            {t("find_a_place")}
          </YellowLink>
        </Link>
      </LinksContainer>
    </Container>
  );
};

export default Banner;
