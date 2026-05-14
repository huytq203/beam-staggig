import { NEXT_PUBLIC_API_CORE } from "@constants/endpoints";
import { ApiHelper } from "src/helpers/api.helper";

export enum NewsAPIEnums {
  ARTICLE = "/news",
}

export const NewsAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  NewsAPIEnums
);
