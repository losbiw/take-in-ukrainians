import styled from "styled-components";
import React, { FC } from "react";
import breakpoints from "@/constants/breakpoints";
import PostType from "@/types/post";
import Post from "./post";

interface Props {
  posts: PostType[];
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  ${breakpoints.md} {
    grid-template-columns: 1fr 1fr;
  }

  ${breakpoints.lg} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const PostsContainer: FC<Props> = ({ posts }) => (
  <Container>
    {posts.map(({ title, city, max_people, post_id }) => (
      <Post
        key={`${title}${city}`}
        title={title}
        city={city}
        max_people={max_people}
        post_id={post_id}
      />
    ))}
  </Container>
);

export default PostsContainer;
