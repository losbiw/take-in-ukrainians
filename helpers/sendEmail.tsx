import colors from "@/constants/colors";

interface Link {
  href: string;
  text: string;
}

const generateEmailTemplate = (
  title: string,
  description: string,
  { href, text }: Link
) =>
  `<div style="padding: 2rem; font-family: sans-serif; color: ${colors.black};">
    <h2 style="color: ${colors.blue}; margin: 0 auto; text-align: center;">Take in <span style="color: ${colors.yellow};">Ukrainians</span></h2>
    <h1 style="margin: 3rem auto 1rem; text-align: center;">${title}</h1>
    <p style="margin: 0 auto; text-align: center; font-size: 1.15rem;">${description}</p>
    <a style="display: block; font-size: 1.1rem; color: white; background-color: ${colors.blue}; border-radius: 15px; font-weight: 500; text-decoration: none; text-align: center; width: 40%; padding: 0.5rem 1rem; margin: 4rem auto;" href="${href}">${text}</a>
  </div>`;

export default generateEmailTemplate;
