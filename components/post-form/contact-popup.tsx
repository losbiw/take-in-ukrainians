import useTranslation from "next-translate/useTranslation";
import React, { FC, useState } from "react";
import styled from "styled-components";
import colors from "@/constants/colors";
import Input from "../inputs/input";
import Submit from "../inputs/submit";

interface Props {
  placeholder: string;
  closePopup: () => void;
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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  z-index: 5;
`;

const Container = styled.div`
  background-color: white;
  border: 1px solid ${colors.grey};
  padding: 2.5rem 3rem;
  border-radius: 2rem;
`;

const ContactPopup: FC<Props> = ({ placeholder, closePopup }) => {
  const { t } = useTranslation("contact");
  const [input, setInput] = useState("");

  return (
    <OuterContainer>
      <Overlay onClick={closePopup} />

      <Container>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
        />
        <Submit value={t("Submit")} />
      </Container>
    </OuterContainer>
  );
};

export default ContactPopup;
