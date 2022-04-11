import Post from "@/types/post";

type PostWithoutIDs = Omit<Post, "user_id" | "post_id">;

type Errors<T> = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof T]: {
    [key: string]: boolean;
  };
};

type ErrorTuple<T> = [boolean, Errors<T>];

interface AuthInfo {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export type PostErrors = Errors<PostWithoutIDs>;
export type ValidationErrors = Errors<AuthInfo>;

const areErrorsPresent = (errors: Errors<any>) => {
  let areErrors = false;

  Object.keys(errors).forEach((errorType) => {
    const errorCategory = errors[errorType];

    Object.keys(errorCategory).forEach((key) => {
      if (errorCategory[key]) {
        areErrors = true;
      }
    });
  });

  return areErrors;
};

const validatePassword = (password: string) => ({
  password_below_limit: password.length < 8,
  password_doesnt_include_letters: !/(?=.*[a-zA-Z])/.test(password),
  password_doesnt_include_numbers: !/(?=.*\d)/.test(password),
});

const validateAuth = ({
  email,
  password,
  passwordConfirmation,
}: AuthInfo): ErrorTuple<Omit<AuthInfo, "password">> => {
  const errors = {
    email: {
      email_invalid_format: !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        email
      ),
    },
    passwordConfirmation: {
      passwords_dont_match: password !== passwordConfirmation,
    },
    sever: {},
  };

  return [areErrorsPresent(errors), errors];
};

const validatePost = ({
  title,
  description,
  max_people,
  is_offering,
}: PostWithoutIDs): ErrorTuple<
  Omit<PostWithoutIDs, "city" | "is_offering">
> => {
  const errors = {
    title: {
      title_below_limit: title.length < 5,
      title_above_limit: title.length > 80,
    },
    description: {
      description_above_limit: description.length > 300,
    },
    max_people: {
      max_people_below_limit: is_offering && max_people < 1,
      max_people_above_limit: max_people > 10,
    },
    server: {},
  };

  return [areErrorsPresent(errors), errors];
};

export default {
  post: validatePost,
  auth: validateAuth,
  password: validatePassword,
};
