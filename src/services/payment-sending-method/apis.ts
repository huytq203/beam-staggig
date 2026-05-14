import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum PaymentSendingMethodAPIEnums {
  PAYMENT_SENDING_METHOD = '/payment-sending-method',
  PAYMENT_SENDING_METHOD_DEFAULT = '/payment-sending-method-default'

}

export const PaymentSendingMethodAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  PaymentSendingMethodAPIEnums
);