import { NextPage } from "next";
import React from "react";
import { useRouter } from "next/router";
import Information from "@/components/information";

const ConfirmEmail: NextPage = () => {
  const {
    query: { type },
  } = useRouter();

  return <Information namespace="email-sent" type={type as string} />;
};

export default ConfirmEmail;
