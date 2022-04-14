import styled from "styled-components";
import React, { FC } from "react";
import breakpoints from "@/constants/breakpoints";
import PostType from "@/types/post";
import Post from "./post";

interface Props {
  posts: PostType[];
  areControlsEnabled?: boolean;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 1.5rem;

  ${breakpoints.md} {
    grid-template-columns: 1fr 1fr;
  }

  ${breakpoints.lg} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const PostsContainer: FC<Props> = ({ posts, areControlsEnabled }) => (
  <Container>
    {posts.map((post) => (
      <Post
        key={`${post.title}${post.city_name}`}
        areControlsEnabled={areControlsEnabled}
        {...post}
      />
    ))}
  </Container>
);

export default PostsContainer;
