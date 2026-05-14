import { NEXT_PUBLIC_API_CORE2 } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';
export enum ExpenditureAPIEnums {
  BASE_EXPENDITURE = '/accounting',
}

export const ExpenditureAPIs = ApiHelper.getListUri(NEXT_PUBLIC_API_CORE2, ExpenditureAPIEnums);
