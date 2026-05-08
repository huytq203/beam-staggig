import { ObjectHelper } from '@helpers/object.helper';
import { axiosInstance } from '../api/axiosInstance';
import { ReconciliationAPIs } from './apis';

export class ReconciliationService {
  static async getAll(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${ReconciliationAPIs.GET_LIST_RECONCILIATION}?${params}`
    );
    return x.data;
  }

  static async getAllTransactionProcess(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${ReconciliationAPIs.GET_LIST_TRANSACTION_MISMATCH_TRANSACTION}?${params}`
    );
    return x?.data?.data;
  }

  static async updateTransactionProcessProperties(data: any) {
    const x = await axiosInstance.put(
      `${ReconciliationAPIs.GET_LIST_TRANSACTION_MISMATCH_TRANSACTION}`,
      data
    );
    return x?.data?.data;
  }

  static async getAllTransactionUpdate(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${ReconciliationAPIs.GET_LIST_TRANSACTION_UPDATE_TRANSACTION}?${params}`
    );
    return x?.data?.data;
  }

  static async getAllTicketUpdateList(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${ReconciliationAPIs.GET_LIST_TRANSACTION_UPDATE_TRANSACTION}?${params}`
    );
    return x?.data?.data;
  }

  static async getTransactionDetail(beamCode: any) {
    const x = await axiosInstance.get(
      `${ReconciliationAPIs.GET_DETAIL_MISMATCH_TICKET}?refNum=${beamCode}`
    );
    return x?.data?.data;
  }

  static async getTransactionWithHistory(id: any) {
    const x = await axiosInstance.get(
      `${ReconciliationAPIs.GET_LIST_TRANSACTION_UPDATE_TRANSACTION}/${id}`
    );
    return x?.data?.data;
  }

  static async newTransactionTicket(data: any) {
    const x = await axiosInstance.post(
      `${ReconciliationAPIs.BASE_TRANSACTION}/update-transaction-tickets`,
      data
    );
    return x?.data?.data;
  }

  static async updateTransactionTicket(data: any) {
    const id = data?.id;
    const requestType = 1;
    const requestParams = {
      status: data?.confirmationType,
      description: '',
    };
    const x = await axiosInstance.put(
      `${ReconciliationAPIs.BASE_TRANSACTION}/update-transaction-tickets/${id}?requestType=${requestType}`,
      requestParams
    );
    return x?.data?.data;
  }

  static async getListEndMonthReconciliation(data: any) {
    const params = ObjectHelper.getParamsFilter(data);
    const x = await axiosInstance.post(
      `${ReconciliationAPIs.BASE_RECONCILIATION}/list-files?${params} `,
      data
    );
    return x?.data?.data;
  }

  static async getListCompaniesReconciliation(data: any) {
    // const page = data?.page ? data?.page : 1;
    // if (data?.page) {
    const x = await axiosInstance.post(
      `${ReconciliationAPIs.RECONCILIATION}/companies-reconciliation`,
      data
    );
    return x?.data?.data;
    // }
  }

  static async getAccessReconciliation(companyId: any) {
    // const page = data?.page ? data?.page : 1;
    // if (data?.page) {
    const x = await axiosInstance.get(
      `${ReconciliationAPIs.RECONCILIATION}/get-access?companyId=${companyId}`
    );
    return x?.data?.data;
    // }
  }

  static async uploadFileReconciliationConcern(data: any) {
    const x = await axiosInstance.post(
      `${ReconciliationAPIs.UPLOAD_FILE_RECONCILIATION_CONCERN}`,
      data
    );
    // if (ResponseHelpers.CheckSucessResponse(x)) {
    return x;
  }

  static async uploadFileReconciliationConcernLandingPage(data: any) {
    const x = await axiosInstance.post(
      `${ReconciliationAPIs.UPLOAD_FILE_RECONCILIATION_CONCERN}`,
      data
    );
    // if (ResponseHelpers.CheckSucessResponse(x)) {
    return x;
  }
  static async getReconciliationLandingPage(param: any) {
    const params = new URLSearchParams({
      ...param,
    }).toString();
    const x = await axiosInstance.get(
      `${ReconciliationAPIs.GET_RECONCILIATION_LANDING}?${params}`
    );
    return x?.data?.data;
  }
}
