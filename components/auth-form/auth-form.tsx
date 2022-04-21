import React, { FC, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import colors from "@/constants/colors";
import Input from "../inputs/input";
import validateInputs, { ValidationErrors } from "@/helpers/validateInputs";
import renderErrors from "@/helpers/renderErrors";
import { Title } from "../general/title";
import ShowPasswordIcon from "../../public/assets/icons/show-password.svg";
import HidePasswordIcon from "../../public/assets/icons/hide-password.svg";
import AuthLink from "./auth-link";

export type FormType = "login" | "signup" | "recovery" | "new-password";

interface Errors extends ValidationErrors {
  server: {
    [key: string]: boolean;
  };
}

interface AuthLinkInfo {
  text: string;
  highlited: string;
  href: string;
}

interface Field {
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  key: "email" | "password" | "passwordConfirmation";
}

interface Props {
  formType: FormType;
  title: string;
  description: string;
  fields: Field[];
  authLink?: AuthLinkInfo;
  token?: string;
}

const Container = styled.div`
  min-height: 100vh;
  padding: 5rem 9%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Description = styled.p`
  color: ${colors.darkGrey};
  font-size: 1rem;
  margin: 0 0 2rem;
`;

const Submit = styled(Input)`
  background: ${colors.blue};
  font-weight: 500;
  color: ${colors.white};
  margin: 2.5rem 0 0.8rem;
  transition: 0.2s;

  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const PasswordVisibilityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  position: absolute;
  right: 1.3rem;
  top: 50%;
  transform: translateY(-50%);
`;

const SharedPasswordIconStyled = `
  height: 1.3rem;
  width: 1.3rem;

  * {
    fill: ${colors.darkGrey};
  }

  &:hover {
    * {
      fill: ${colors.grey};
    }
  }
`;

const ShowPassword = styled(ShowPasswordIcon)`
  ${SharedPasswordIconStyled}
`;

const HidePassword = styled(HidePasswordIcon)`
  ${SharedPasswordIconStyled}
`;

const PasswordRequirementWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1.5rem 0 1rem;
`;

const PasswordRequirementContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;

  &:first-child {
    margin-top: 0;
  }
`;

const Checkmark = styled.div<{ isComplete: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ isComplete }) => (isComplete ? colors.blue : colors.grey)};
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  margin-right: 0.9rem;
  transition: 0.2s;

  img {
    width: 60%;
    height: 60%;
  }
`;

const PasswordRequirementExplanation = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
  color: ${colors.grey};
  margin: 0;
`;

const AuthForm: FC<Props> = ({
  formType,
  title,
  description,
  fields,
  authLink,
  token,
}) => {
  const router = useRouter();
  const { t } = useTranslation("auth");

  const [errors, setErrors] = useState<Partial<Errors>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(
    validateInputs.password("")
  );

  // eslint-disable-next-line consistent-return
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [areErrorsPresent, inputErrors] = validateInputs.auth({
      email,
      password,
      passwordConfirmation,
      formType,
      includePassword: true,
    });

    if (areErrorsPresent) {
      return setErrors(inputErrors);
    }

    const res = await fetch(
      `/api/auth/${formType}?${token ? `token=${token}` : ""}`,
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      let finalPath = "/dashboard";

      if (formType === "recovery") {
        finalPath = "/email-sent?type=passwordRecovery";
      } else if (formType === "signup") {
        finalPath = "/email-sent?type=emailConfirmation";
      }

      router.push(finalPath);
    } else {
      const json = await res.json();

      const errorsCopy = {
        ...errors,
        server: {
          [json.message]: true,
        },
      };

      setErrors(errorsCopy);
    }
  };

  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>

      <form onSubmit={handleSubmit}>
        {fields.map(({ type, placeholder, key }) => (
          <InputWrapper key={placeholder}>
            {key === "password" && (
              <PasswordVisibilityButton
                onClick={(e) => {
                  e.preventDefault();
                  setIsPasswordVisible(!isPasswordVisible);
                }}
              >
                {isPasswordVisible ? <HidePassword /> : <ShowPassword />}
              </PasswordVisibilityButton>
            )}

            <Input
              type={type === "password" && isPasswordVisible ? "text" : type}
              placeholder={placeholder}
              onChange={(e) => {
                const { value } = e.target;

                setErrors(undefined);

                if (key === "email") setEmail(value);
                else if (key === "password") {
                  setPassword(value);

                  setPasswordValidation(validateInputs.password(value));
                } else if (key === "passwordConfirmation")
                  setPasswordConfirmation(value);
              }}
            />

            {key !== "password" &&
              errors &&
              renderErrors(errors, key, { t, namespace: "auth" })}
          </InputWrapper>
        ))}

        {errors && renderErrors(errors, "server", { t })}

        {(formType === "new-password" || formType === "signup") && (
          <PasswordRequirementWrapper>
            {Object.keys(passwordValidation).map((key) => (
              <PasswordRequirementContainer key={key}>
                <Checkmark
                  isComplete={
                    !passwordValidation[key as keyof typeof passwordValidation]
                  }
                >
                  <img src="/assets/icons/checkmark.png" alt="checkmark" />
                </Checkmark>
                <PasswordRequirementExplanation>
                  {t(key)}
                </PasswordRequirementExplanation>
              </PasswordRequirementContainer>
            ))}
          </PasswordRequirementWrapper>
        )}

        {formType === "login" && (
          <Link href="/auth/recovery">
            <AuthLink className="margin-top" href="/auth/recovery">
              <span className="highlited">
                {t("login:forgot your password")}
              </span>
            </AuthLink>
          </Link>
        )}

        <Submit type="submit" value={title} />

        {authLink && (
          <Link href={authLink.href}>
            <AuthLink href={authLink.href}>
              {authLink.text}{" "}
              <span className="highlited">{authLink.highlited}</span>
            </AuthLink>
          </Link>
        )}
      </form>
    </Container>
  );
};

export default AuthForm;
