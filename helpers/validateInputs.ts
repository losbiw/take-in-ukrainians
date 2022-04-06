import Post from "@/types/post";

type PostWithoutIDs = Omit<Post, "userId" | "postId">;

type Errors<T> = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof T]: {
    [key: string]: boolean;
  };
};

interface AuthInfo {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export type PostErrors = Errors<PostWithoutIDs>;
export type AuthErrors = Errors<AuthInfo>;

const validateAuth = ({ email, password, passwordConfirmation }: AuthInfo) => {
  const errors = {
    email: {
      email_invalid_format: !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        email
      ),
    },
    passwordConfirmation: {
      passwords_dont_match: password !== passwordConfirmation,
    },
  };

  return errors;
};

const validatePassword = (password: string) => ({
  password_below_limit: password.length < 8,
  password_doesnt_include_letters: !/(?=.*[a-zA-Z])/.test(password),
  password_doesnt_include_numbers: !/(?=.*\d)/.test(password),
});

const validatePost = ({
  title,
  description,
  maxPeople,
  isOffering,
}: PostWithoutIDs) => {
  const errors = {
    title: {
      title_below_limit: title.length < 5,
      title_above_limit: title.length > 80,
    },
    description: {
      description_above_limit: description.length > 300,
    },
    maxPeople: {
      max_people_below_limit: isOffering && maxPeople < 1,
      max_people_above_limit: maxPeople > 10,
    },
  };

  return errors;
};

export default {
  post: validatePost,
  auth: validateAuth,
  password: validatePassword,
};
