import { axiosInstance } from '../api/axiosInstance';
import { PaymentAPIs } from './apis';

export class PaymentService {
  static async getTransactionRequestForm(transactionId: string) {
    const x = await axiosInstance.get(
      `${PaymentAPIs.EMPTY_BANK}/payment/reporting/transactions/${transactionId}/request-form`
    );
    return x?.data?.data;
  }
  static async getTicketRequestForm(ticketId: string) {
    const x = await axiosInstance.get(
      `${PaymentAPIs.EMPTY_BANK}/payment/reporting/tickets/${ticketId}/request-form`
    );
    return x?.data?.data;
  }
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
