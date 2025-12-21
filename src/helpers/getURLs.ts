import { Regex } from "@/data/regex";

const getURLs = (text: string): string[] => {
  if (!text) {
    return [];
  }
  return text.match(Regex.url) || [];
};

export default getURLs;
