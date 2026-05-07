import { NEXT_PUBLIC_API_CORE2 } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum ChartAPIEnums {
  BASE_CHART = '/visualization',
}

export const ChartAPIs = ApiHelper.getListUri(NEXT_PUBLIC_API_CORE2, ChartAPIEnums);
