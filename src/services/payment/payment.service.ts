import { axiosInstance } from '../api/axiosInstance';
import { PaymentAPIs } from './apis';

export class PaymentService {
  static async getPaymentAccountInfoVPBank() {
    const x = await axiosInstance.get(`${PaymentAPIs.BASE_BANK}/account-info`);
    const response = x?.data?.data;
    return {
      ...response,
      date: new Date(),
    };
  }
  static async getPaymentAccountInfoPVBank() {
    const x = await axiosInstance.get(
      `${PaymentAPIs.EMPTY_BANK}/pvcombank/account-info`
    );
    const response = x?.data?.data;
    return {
      ...response,
      date: new Date(),
    };
  }
  static async getPaymentAccountInfoVCB() {
    const x = await axiosInstance.get(
      `${PaymentAPIs.EMPTY_BANK}/vietcombank/account-info`
    );
    const response = x?.data?.data;
    return {
      ...response,
      date: new Date(),
    };
  }
}
