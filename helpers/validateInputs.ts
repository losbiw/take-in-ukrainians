import { FormType } from "@/components/auth-form/form";
import Post from "@/types/post";
import { ContactData } from "@/types/contacts";

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
  formType: FormType;
}

interface AuthValidationArgs extends AuthInfo {
  includePassword?: boolean;
}

export type PostErrors = Errors<PostWithoutIDs>;
export type ValidationErrors = Errors<AuthInfo>;
export type ContactErrors = Errors<ContactData>;

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
  formType,
  includePassword,
}: AuthValidationArgs): ErrorTuple<Omit<AuthInfo, "formType">> => {
  const errors = {
    email: {
      email_not_present: !email,
      email_invalid_format:
        formType !== "new-password" &&
        !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email),
    },
    password: includePassword ? validatePassword(password) : {},
    passwordConfirmation: {
      passwords_dont_match:
        (formType === "signup" || formType === "new-password") &&
        password !== passwordConfirmation,
    },
  };

  return [areErrorsPresent(errors), errors];
};

const validatePost = ({
  title,
  description,
  people_number,
  is_offering,
  city_id,
  city_name,
}: PostWithoutIDs): ErrorTuple<Omit<PostWithoutIDs, "is_offering">> => {
  const errors = {
    title: {
      title_below_limit: title.length < 5,
      title_above_limit: title.length > 80,
    },
    description: {
      description_above_limit: description.length > 300,
    },
    people_number: {
      people_number_below_limit: people_number < 1,
      people_number_above_limit: is_offering && people_number > 10,
    },
    city_name: {
      is_in_russia:
        /Russia/.test(city_name) ||
        /Belarus/.test(city_name) ||
        /Россия/.test(city_name) ||
        /Беларусь/.test(city_name),
    },
    city_id: {
      city_not_selected: !city_name,
      city_lacks_id: !!city_name && !city_id,
    },
    server: {},
  };

  return [areErrorsPresent(errors), errors];
};

const validatePhoneNumber = (phone: string) =>
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(phone);

const validateContactInfo = ({
  facebook,
  telegram,
  viber,
  whatsapp,
}: ContactData): ErrorTuple<ContactData> => {
  const errors = {
    facebook: {
      isnt_a_facebook_link:
        !!facebook && !/https:\/\/facebook.com/.test(facebook),
    },
    instagram: {},
    telegram: {
      incorrect_phone_format:
        !!telegram && /\+/.test(telegram) && !validatePhoneNumber(telegram),
    },
    viber: {
      incorrect_phone_format: !!viber && !validatePhoneNumber(viber),
    },
    whatsapp: {
      incorrect_phone_format: !!whatsapp && !validatePhoneNumber(whatsapp),
    },
  };

  return [areErrorsPresent(errors), errors];
};

export default {
  post: validatePost,
  auth: validateAuth,
  password: validatePassword,
  contactInfo: validateContactInfo,
};
