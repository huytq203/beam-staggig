import { NEXT_PUBLIC_API_CORE2 } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum ReportAPIEnums {
  BASE_REPORT = '/reporting',
  OPERATION_REPORT = '/operation-reporting',
  CLASIFICATION_REPORT = '/employee-ranking',
}

export const ReportAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE2,
  ReportAPIEnums
);
