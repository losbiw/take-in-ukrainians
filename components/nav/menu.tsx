import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import breakpoints from "@/constants/breakpoints";
import colors from "@/constants/colors";

interface Props {
  links: {
    placeholder: string;
    href: string;
  }[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(3px);

  a {
    margin: 1rem 0;
    color: ${colors.darkGrey};
    transition: 0.15s;
    font-size: 1.1rem;

    &:hover {
      color: ${colors.grey};
    }
  }

  ${breakpoints.md} {
    position: relative;
    flex-direction: row;

    a {
      font-size: 0.9rem;
      margin: 0 2rem;
    }
  }
`;

const Menu: FC<Props> = ({ links, children }) => {
  const { t } = useTranslation("general");
  return (
    <Container>
      {links.map(({ placeholder, href }) => (
        <Link href={href} key={href}>
          <a href={href}>{t(placeholder)}</a>
        </Link>
      ))}

      {children}
    </Container>
  );
};

export default Menu;
