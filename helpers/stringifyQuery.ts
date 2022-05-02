const stringifyQuery = (obj: any) => {
  let encoded = "";

  Object.keys(obj).forEach((prop) => {
    encoded += `${prop}=${encodeURIComponent(obj[prop])}`;
  });

  return encoded;
};

export default stringifyQuery;
