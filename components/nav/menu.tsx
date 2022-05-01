import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import breakpoints from "@/constants/breakpoints";
import colors from "@/constants/colors";
import Overlay from "../general/overlay";

interface Props {
  closeMenu: () => void;
  links: {
    placeholder: string;
    href: string;
  }[];
}

const Container = styled(Overlay)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(3px);

  a {
    margin: 1rem 0;
    color: ${colors.darkGrey};
    transition: 0.15s;
    font-size: 1.1rem;

    &.active {
      color: ${colors.black};
      font-weight: 500;
      pointer-events: none;
    }

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

const Menu: FC<Props> = ({ links, closeMenu, children }) => {
  const { t } = useTranslation("general");
  const router = useRouter();

  return (
    <Container>
      {links.map(({ placeholder, href }) => (
        <Link href={href} key={href}>
          <a
            className={href === router.asPath ? "active" : ""}
            onClick={closeMenu}
            href={href}
          >
            {t(placeholder)}
          </a>
        </Link>
      ))}

      {children}
    </Container>
  );
};

export default Menu;
