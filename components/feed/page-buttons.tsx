import Link from "next/link";
import styled from "styled-components";
import React, { FC, memo } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import colors from "@/constants/colors";
import { PageData } from "@/pages/feed/[page]";

interface Props {
  pageData: PageData;
}

const PageButton = styled.a<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: ${({ isActive }) => (isActive ? colors.white : colors.grey)};
  background-color: ${({ isActive }) =>
    isActive ? colors.blue : colors.white};
  border: none;
  border-radius: 50%;
  margin: 0 0.5rem;

  ${({ isActive }) => (isActive ? "pointer-events: none;" : "")}
`;

const Dots = styled.p`
  font-size: 1.5rem;
  margin: 0 1rem;
  colors: ${colors.grey};
`;

const getInitialIndex = ({ current, total }: PageData) => {
  if (current === 1) return 1;
  if (current === total) return current - 2;

  return current - 1;
};

const stringifyQuery = (query: ParsedUrlQuery) => {
  const queryKeys = Object.keys(query);

  return queryKeys.reduce((acc, key, i) => {
    if (key !== "page") {
      return `${acc}${key}=${query[key]}${
        i !== queryKeys.length - 1 ? "&" : ""
      }`;
    }
    return acc;
  }, "");
};

const PageButtons: FC<Props> = ({ pageData }) => {
  const { query } = useRouter();
  const { current, total } = pageData;
  const buttons = [];

  const initialIndex = getInitialIndex(pageData);
  const finalIndex = total < 3 ? total : initialIndex + 2;

  const queryKeys = Object.keys(query);
  const pageParamIndex = queryKeys.indexOf("page");

  queryKeys.splice(pageParamIndex);

  const stringifiedQuery = stringifyQuery(query);

  for (let i = initialIndex; i <= finalIndex; i++) {
    const isCurrent = i === current;

    const href = `/feed/${i}?${stringifiedQuery}`;

    buttons.push(
      <Link href={href} key={href}>
        <PageButton href={href} isActive={isCurrent}>
          {i}
        </PageButton>
      </Link>
    );
  }

  if (finalIndex < total) {
    const href = `/feed/${total}?${query}`;

    buttons.push(
      <>
        <Dots>...</Dots>
        <Link href={href} key={href}>
          <PageButton href={href}>{total}</PageButton>
        </Link>
      </>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{buttons}</>;
};

export default memo(PageButtons);
