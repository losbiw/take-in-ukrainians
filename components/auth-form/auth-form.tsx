import React, { FC, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import colors from "@/constants/colors";
import Input from "./input";

interface Field {
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  key: "email" | "password" | "passwordConfirmation";
}

interface Props {
  formType: "login" | "signup" | "recovery";
  title: string;
  description: string;
  fields: Field[];
}

const Container = styled.div`
  padding: 0 9%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  color: ${colors.black};
  font-size: 1.5rem;
  margin: 0 0 1.5rem;
`;

const Description = styled.p`
  color: ${colors.darkGrey};
  font-size: 1rem;
  margin: 0 0 3.5rem;
`;

const Error = styled.p`
  font-size: 0.9rem;
  margin: 1rem 0 0;
  color: ${colors.red};
`;

const Submit = styled(Input)`
  background: ${colors.blue};
  font-weight: 500;
  color: ${colors.white};
  margin-top: 2.5rem;
`;

const AuthForm: FC<Props> = ({
  formType,
  title,
  description,
  fields,
  children,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password, passwordConfirmation } = formData;

    if (formType === "signup" && password !== passwordConfirmation) return;

    const res = await fetch(`/api/auth/${formType}`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const json = await res.json();

      setError(json.message);
    }
  };

  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>

      <form onSubmit={handleSubmit}>
        {fields.map(({ type, placeholder, key }) => (
          <Input
            key={placeholder}
            type={type}
            placeholder={placeholder}
            onChange={(e) => {
              const { value } = e.target;

              const formDataCopy = { ...formData };
              formDataCopy[key] = value;

              setFormData(formDataCopy);
            }}
          />
        ))}

        {error.length > 0 && <Error>{t(error)}</Error>}

        <Submit type="submit" value={title} />

        {children}
      </form>
    </Container>
  );
};

export default AuthForm;
