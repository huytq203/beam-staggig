import { axiosInstance } from '@services/api';
import { BankAPIs } from './apis';

export class BankServices {
  static getListBanks(filter: any) {
    const params = new URLSearchParams(filter).toString();
    return axiosInstance.get(`${BankAPIs.GET_LIST_BANKS}`, filter);
  }
  static async getListBankBranchs(id: any) {
    const x = await axiosInstance.get(`${BankAPIs.GET_LIST_BANKS}/${id}`);
    return x?.data?.data;
  }
}
