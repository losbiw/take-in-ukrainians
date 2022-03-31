const validateEmail = (email: string): boolean =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

const validatePassword = (password: string): boolean | string[] => {
  const issues: string[] = [];

  if (password.length < 8)
    issues.push("The password must be at least 8 characters long");
  if (!/(?=.*[a-zA-Z])/.test(password))
    issues.push("The password must include at least one letter");
  if (!/(?=.*\d)/.test(password))
    issues.push("The password must include at least one number");
  if (!/(?=.*[!#$%&? "])/.test(password))
    issues.push("The password must include at least one special character");

  return issues.length === 0 ? true : issues;
};

export default {
  email: validateEmail,
  password: validatePassword,
};
