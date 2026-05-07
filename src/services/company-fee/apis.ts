import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum CompanyFeePolicyAPIEnums {
  COMPANY_FEE_BASE_URL = '/fee-policies/company',
  DELETE_COMPANY_FEE = '/fee-policies/delete-company',
}

export const CompanyFeePolicyAPIs = ApiHelper.getListUri(NEXT_PUBLIC_API_CORE, CompanyFeePolicyAPIEnums);
