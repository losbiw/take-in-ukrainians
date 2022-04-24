import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import Information from "@/components/information";
import { Button, DangerousButton } from "@/components/buttons/buttons";
import server from "@/constants/server";

const DeleteAccount: NextPage = () => {
  const { t } = useTranslation("delete-account");
  const router = useRouter();

  const deleteAccount = async () => {
    const res = await fetch(`${server}/api/user`, {
      method: "DELETE",
    });

    const json = await res.json();

    if (json.deleted) {
      router.push("/");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Head>
        <title>{t("delete account")} | Take in Ukrainians</title>
      </Head>

      <Information namespace="delete-account">
        <Link href="/dashboard">
          <Button href="/dashboard">{t("discard")}</Button>
        </Link>

        <DangerousButton onClick={deleteAccount}>
          {t("delete account")}
        </DangerousButton>
      </Information>
    </>
  );
};

export default DeleteAccount;
