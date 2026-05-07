import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum CompanyAPIEnums {
  GET_LIST_COMPANY = '/companies',
  BLOCK_COMPANY = '/companies/block',
  UNBLOCK_COMPANY = '/companies/unlock',
  CHECK_AVAILABILITY_TAX_NUMBER = '/companies/check-tax-number-duplicated ',
  BASE_PROFILE = '/profiles',
  HR_COMPANY = '/companies-hr',
  GET_LIST_COMPANY_FEE = '/companies/feePolicy',
  GET_SALARY_PERIODS = '/accounting/company',
  GET_PAY_LIMIT = '/companies/pay-limit',
  GET_LIST_COMMON = '/common',
}

export const CompanyAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  CompanyAPIEnums
);
