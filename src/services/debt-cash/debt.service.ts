import { FunctionBase } from '@helpers/fuction-base.helpers';
import { ObjectHelper } from '@helpers/object.helper';
import { axiosInstance } from '../api/axiosInstance';
import { DebtAPIs } from './apis';

export class DebtService {
  static async getAllSalaryPeriods(companyId: any) {
    const x = await axiosInstance.get(
      `${DebtAPIs.BASE_ACCOUNTING}/company/${companyId}/salary-periods`
    );
    return x?.data;
  }

  static async getSalaryPeriodCashFlow(companyIds: any) {
    const x = await axiosInstance.post(
      `${DebtAPIs.BASE_ACCOUNTING}/companies/salary-periods`,
      companyIds
    );
    return x?.data?.data;
  }

  static async getListDebts(data: any) {
    const params = ObjectHelper.getParamsFilter(data);
    const x = await axiosInstance.post(
      `${DebtAPIs.BASE_ACCOUNTING}/search?${params}`,
      data
    );
    return x?.data?.data;
  }

  static async getDetailDebt(id: any) {
    const x = await axiosInstance.get(`${DebtAPIs.BASE_ACCOUNTING}/${id}`);
    return x?.data?.data;
  }

  static async createDebt(data: any) {
    const x = await axiosInstance.post(`${DebtAPIs.BASE_ACCOUNTING}`, data);
    const response = x?.data;
    if (
      (response?.code == 200 && response?.message == 'OK') ||
      (response?.code == 200 && response?.message == 'SUCCESS')
    ) {
      return true;
    }
    return false;
    // return x?.data?.data;
  }

  static async editDebt(data: any) {
    const x = await axiosInstance.put(`${DebtAPIs.BASE_ACCOUNTING}`, data);
    const response = x?.data;
    if (
      (response?.code == 200 && response?.message == 'OK') ||
      (response?.code == 200 && response?.message == 'SUCCESS')
    ) {
      return true;
    }
    return false;
    // return x?.data?.data;
  }

  static async getAllCashFlow(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();

    const x = await axiosInstance.get(`${DebtAPIs.BASE_CASH_FLOW}?${params}`);
    return x?.data;
  }

  static async getDebtRandomCode(companyId: any) {
    const x = await axiosInstance.get(
      `${DebtAPIs.BASE_ACCOUNTING}/company/${companyId}/gen-code`
    );
    return x?.data;
  }

  static async getCashflowDetails(data: any) {
    const params = ObjectHelper.getParamsFilter(data);
    const x = await axiosInstance.post(
      `${DebtAPIs.BASE_CASH_FLOW}/details?${params}`,
      data
    );
    return x?.data;
  }

  static async getGracePeriod(companyId: any) {
    const x = await axiosInstance.get(
      `${DebtAPIs.BASE_ACCOUNTING}/company/${companyId}/grace-period`
    );
    return x?.data?.data;
  }

  static async getDebtById(id: any) {
    const x = await axiosInstance.get(`${DebtAPIs.BASE_ACCOUNTING}/${id}`);
    return x?.data?.data;
  }

  static async exportDebt(data: any) {
    const x = await axiosInstance.post(
      `${DebtAPIs.BASE_ACCOUNTING}/exports`,
      data,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
        },
      }
    );
    // if (ResponseHelpers.CheckSucessResponse(x)) {
    return x?.data;
    // }
  }
}
