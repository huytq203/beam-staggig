import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum HRAPIEnums {
  HR_COMPANY_BASE_URL = '/companies-hr/companies',
}

export const HRAPIs = ApiHelper.getListUri(NEXT_PUBLIC_API_CORE, HRAPIEnums);
