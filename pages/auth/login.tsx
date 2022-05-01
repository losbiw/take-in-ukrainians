import React, { memo } from "react";
import { NextPage, GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import SplitContainer from "@/components/auth-form/split-screen";
import Information from "@/components/auth-form/information";
import AuthForm from "@/components/auth-form/form";
import Description from "@/components/general/description";
import MetaTags from "@/components/general/meta";

const Login: NextPage = () => {
  const { t } = useTranslation("login");

  return (
    <>
      <MetaTags title={`${t("login")} | Take in Ukrainians`} />

      <SplitContainer>
        <AuthForm
          title={t("login")}
          description={t("login_to_publish")}
          formType="login"
          fields={[
            { type: "email", placeholder: t("email"), key: "email" },
            {
              type: "password",
              placeholder: t("password"),
              key: "password",
            },
          ]}
          authLink={{
            text: t("dont_have_account"),
            highlited: t("signup"),
            href: "/auth/signup",
          }}
        />

        <Information
          title={t("couple_of_clicks")}
          description={t("give_a_chance")}
          bubblesData={{
            title: t("link_social_media"),
            images: [
              "/assets/social-media/facebook.png",
              "/assets/social-media/messenger.png",
              "/assets/social-media/telegram.png",
            ],
            Description: memo(() => (
              <Description>{t("people_can_get_in_touch")}</Description>
            )),
          }}
        />
      </SplitContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.req.cookies.token) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Login;
