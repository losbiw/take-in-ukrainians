import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import colors from "@/constants/colors";
import Icon from "../../public/assets/icons/menu.svg";

interface Props {
  postId: number;
}

const VisibilityButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1rem;
  background: transparent;
  border: none;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 2.7rem;
  right: 2.5rem;
  padding: 0.5rem;
  background: ${colors.white};
  border-radius: 0.7rem;
  box-shadow: 0 0 20px -5px rgba(0, 0, 0, 0.1);
  border: 1px rgba(0, 0, 100, 0.06) solid;
`;

const StyledLink = styled.a<{ isDangerous?: boolean }>`
  padding: 0.4rem 1rem;
  color: ${colors.black};
  transition: 0.2s;
  border-radius: 0.5rem;

  &:hover {
    color: ${colors.grey};
  }

  ${({ isDangerous }) =>
    isDangerous
      ? `color: ${colors.red};
      &:hover {
        color: ${colors.white};
        background-color: ${colors.red};
      }`
      : ""}
`;

const StyledIcon = styled(Icon)`
  transform: rotate(90deg);
  height: 1.1rem;
  width: 1.1rem;

  * {
    fill: ${colors.darkGrey};
  }

  &:hover {
    * {
      fill: ${colors.grey};
    }
  }
`;

const Controls: FC<Props> = ({ postId }) => {
  const { t } = useTranslation("dashboard");
  const [isControlPanelVisible, setIsControlPanelVisible] = useState(false);
  const buttonRef = useRef(null);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (buttonRef.current && isControlPanelVisible) {
      const handleClick = () => {
        setIsControlPanelVisible(false);
      };

      window.addEventListener("click", handleClick);

      return () => window.removeEventListener("click", handleClick);
    }
  }, [isControlPanelVisible]);

  const links = useMemo(
    () => [
      { placeholder_key: "edit", href: `/dashboard/edit?post_id=${postId}` },
      {
        placeholder_key: "delete",
        href: `/dashboard/delete?post_id=${postId}`,
        isDangerous: true,
      },
    ],
    [postId]
  );

  return (
    <>
      <VisibilityButton
        onClick={() => setIsControlPanelVisible(!isControlPanelVisible)}
        ref={buttonRef}
      >
        <StyledIcon />
      </VisibilityButton>

      {isControlPanelVisible && (
        <Panel>
          {links.map(({ placeholder_key, href, isDangerous }) => (
            <Link href={href}>
              <StyledLink href={href} isDangerous={isDangerous}>
                {t(placeholder_key)}
              </StyledLink>
            </Link>
          ))}
        </Panel>
      )}
    </>
  );
};

export default Controls;
