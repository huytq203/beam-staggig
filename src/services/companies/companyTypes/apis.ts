import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum CompanyTypesAPIEnums {
  BASE_COMPANY_TYPES = '/company-types',
}

export const CompanyTypeAPIs = ApiHelper.getListUri(NEXT_PUBLIC_API_CORE, CompanyTypesAPIEnums);
