import { ContactMethod } from "@/types/contacts";

interface ContactMethodInterface {
  name: string;
  placeholder: string;
  baseUrl: string;
}

const contactMethods: Record<ContactMethod, ContactMethodInterface> = {
  facebook: {
    name: "Facebook",
    placeholder: "facebook link",
    baseUrl: "",
  },
  instagram: {
    name: "Instagram",
    placeholder: "instagram nickname",
    baseUrl: "https://instagram.com/",
  },
  telegram: {
    name: "Telegram",
    placeholder: "telegram username",
    baseUrl: "https://t.me/",
  },
  whatsapp: {
    name: "WhatsApp",
    placeholder: "phone number",
    baseUrl: "https://wa.me/",
  },
  viber: {
    name: "Viber",
    placeholder: "phone number",
    baseUrl: "viber://chat?number=",
  },
};

export default contactMethods;
