const validateJWT = async () => {
  const payload = await fetch("/api/auth/verify");

  const json = await payload.json();

  return json;
};

export default validateJWT;
