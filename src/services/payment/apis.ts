import { NEXT_PUBLIC_API_PAYMENT } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum PaymentAPIEnums {
  EMPTY_BANK = '/',
  BASE_BANK = '/banks',
}

export const PaymentAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_PAYMENT,
  PaymentAPIEnums
);
