import { HttpLink } from "@apollo/client";
import { LENS_API_URL } from "@/data/constants";

const httpLink = new HttpLink({
  fetch,
  uri: LENS_API_URL
});

export default httpLink;
