import React, { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import colors from "@/constants/colors";
import PostType from "@/types/post";
import Subtitle from "../general/subtitle";
import PostInformation from "./post-information";
import Controls from "./controls";

interface Props extends PostType {
  areControlsEnabled?: boolean;
}

const Title = styled(Subtitle)`
  margin: 0.8rem 0 1.2rem;
`;

const Container = styled.div`
  position: relative;
`;

const LinkContainer = styled.a`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  border-radius: 2rem;
  border: 1px solid ${colors.grey};
`;

const Post: FC<Props> = (props) => {
  const { title, post_id, areControlsEnabled } = props;
  const href = `/post/${post_id}`;

  return (
    <Container>
      {areControlsEnabled && <Controls postId={post_id} />}

      <Link href={href}>
        <LinkContainer href={href}>
          <Title>{title}</Title>

          <PostInformation {...props} />
        </LinkContainer>
      </Link>
    </Container>
  );
};

export default Post;
