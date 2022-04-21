import { SocialMediaName } from "@/constants/socials";

// eslint-disable-next-line no-unused-vars
type Contact = { [key in SocialMediaName]: string | null };

interface User extends Contact {
  email: string;
  password: string;
  user_id: number;
  is_admin: boolean;
  posts_id: number[];
}

export default User;
