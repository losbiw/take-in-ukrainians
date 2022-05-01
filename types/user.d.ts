import { ContactMethod } from "./contacts";

// eslint-disable-next-line no-unused-vars
type Contact = { [key in ContactMethod]: string | null };

interface User extends Contact {
  email: string;
  password: string;
  user_id: number;
  is_admin: boolean;
  posts_id: number[];
}

export default User;
