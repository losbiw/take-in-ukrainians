export const sizes = {
  sm: 567,
  md: 768,
  lg: 992,
  xl: 1200,
};

const queries: any = {};

type SizeKey = keyof typeof sizes;

type SizeLike = {
  // eslint-disable-next-line no-unused-vars
  [key in SizeKey]: string;
};

Object.keys(sizes).forEach((key) => {
  queries[`${key}` as SizeKey] = `@media only screen and (min-width: ${
    sizes[key as SizeKey]
  }px)`;
});

const breakpoints = queries as SizeLike;

export default breakpoints;
