import useTranslation from "next-translate/useTranslation";
import React, { FC, useState } from "react";
import styled from "styled-components";
import colors from "@/constants/colors";
import Input from "../inputs/input";
import Submit from "../inputs/submit";
import server from "@/constants/server";
import Subtitle from "../general/subtitle";
import breakpoints from "@/constants/breakpoints";
import validateInputs, { ContactErrors } from "@/helpers/validateInputs";
import renderErrors from "@/helpers/renderErrors";
import { ContactMethod } from "@/types/contacts";
import Overlay from "../general/overlay";

interface Props {
  name: ContactMethod;
  title: string;
  placeholder: string;
  defaultValue?: string;
  // eslint-disable-next-line no-unused-vars
  closePopup: (value?: string) => void;
}

const OuterContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  & > * {
    z-index: 10;
  }
`;

const OutsideHandler = styled(Overlay)`
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  z-index: 5;
`;

const Container = styled.div`
  width: 90%;
  background-color: white;
  border: 1px solid ${colors.grey};
  padding: 2.5rem 3rem;
  border-radius: 2rem;

  ${breakpoints.md} {
    width: 50%;
  }
`;

const ContactPopup: FC<Props> = ({
  placeholder,
  title,
  closePopup,
  name,
  defaultValue,
}) => {
  const { t } = useTranslation("contact");
  const [input, setInput] = useState(defaultValue || "");
  const [errors, setErrors] = useState<ContactErrors>();

  const handleClick = async () => {
    const [areErrors, validationErrors] = validateInputs.contactInfo({
      [name]: input,
    });

    if (areErrors) {
      return setErrors(validationErrors);
    }

    const res = await fetch(`${server}/api/user/contact`, {
      method: "POST",
      body: JSON.stringify({
        [name]: input,
      }),
    });

    if (res.ok) {
      closePopup(input);
    }
  };

  return (
    <OuterContainer>
      <OutsideHandler onClick={() => closePopup()} />

      <Container>
        <Subtitle>{title}</Subtitle>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
        />

        {errors && renderErrors(errors, name, { t, namespace: "create-post" })}

        <Submit type="submit" value={t("Submit")} onClick={handleClick} />
      </Container>
    </OuterContainer>
  );
};

export default ContactPopup;
