export type ContactMethod =
  | "facebook"
  | "instagram"
  | "telegram"
  | "whatsapp"
  | "viber";

export type ContactData = Partial<Record<ContactMethod, string>>;
