export interface SocialMedia {
  name: string;
  placeholder: string;
}

const socialMedia: Record<string, SocialMedia> = {
  facebook: {
    name: "Facebook",
    placeholder: "facebook link",
  },
  instagram: {
    name: "Instagram",
    placeholder: "instagram nickname",
  },
  telegram: {
    name: "Telegram",
    placeholder: "telegram id or phone",
  },
  whatsapp: {
    name: "WhatsApp",
    placeholder: "phone number",
  },
  viber: {
    name: "Viber",
    placeholder: "phone number",
  },
};

export default socialMedia;
