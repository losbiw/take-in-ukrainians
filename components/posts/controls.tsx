import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import colors from "@/constants/colors";
import Icon from "../../public/assets/icons/menu.svg";
import server from "@/constants/server";

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
  const router = useRouter();
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

  const handleClick = async () => {
    const res = await fetch(`${server}/api/post/${postId}`, {
      method: "DELETE",
    });

    // if (res.ok) {
    router.push(router.asPath);
    // }
  };

  const links = useMemo(
    () => [
      { placeholderKey: "edit", href: `/dashboard/edit/${postId}` },
      {
        placeholderKey: "delete",
        onClick: handleClick,
        href: `/dashboard/delete/${postId}`,
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
          {links.map(({ placeholderKey, href, isDangerous, onClick }) => (
            <Link href={href || ""} key={href}>
              <StyledLink
                href={href || ""}
                onClick={onClick}
                isDangerous={isDangerous}
              >
                {t(placeholderKey)}
              </StyledLink>
            </Link>
          ))}
        </Panel>
      )}
    </>
  );
};

export default Controls;
