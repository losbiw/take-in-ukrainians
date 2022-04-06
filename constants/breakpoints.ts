const sizes = {
  sm: "567px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
};

const queries: any = {};

type SizeKey = keyof typeof sizes;

Object.keys(sizes).forEach((key) => {
  queries[`${key}` as SizeKey] = `@media only screen and (min-width: ${
    sizes[key as SizeKey]
  })`;
});

export default queries as typeof sizes;
