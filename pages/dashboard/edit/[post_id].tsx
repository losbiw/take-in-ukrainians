import { GetServerSideProps } from "next";
import React, { FC } from "react";
import PostForm from "@/components/post-form";

const EditPost: FC = () => <PostForm />;

export const getServerSideProps: GetServerSideProps = () => {};

export default EditPost;
