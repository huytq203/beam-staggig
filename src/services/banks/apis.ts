import { NEXT_PUBLIC_API_CORE } from "@constants/endpoints";
import { ApiHelper } from "src/helpers/api.helper";

export enum BankAPIEnums {
  GET_LIST_BANKS = "/banks",
}

export const BankAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  BankAPIEnums
);
