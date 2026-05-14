import { NEXT_PUBLIC_API_CORE2 } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum DebtAPIEnums {
  BASE_ACCOUNTING = '/accounting',
  BASE_CASH_FLOW = '/cash-flow',
}

export const DebtAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE2,
  DebtAPIEnums
);
