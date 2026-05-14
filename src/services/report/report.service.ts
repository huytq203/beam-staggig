import { ObjectHelper } from '@helpers/object.helper';
import { axiosInstance } from '../api/axiosInstance';
import { ReportAPIs } from './apis';

export class ReportService {
  static async getAllReportTransaction(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${ReportAPIs.BASE_REPORT}/transactions?${params}`
    );
    return x?.data;
  }
  static async exportReportTransaction(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${ReportAPIs.BASE_REPORT}/export-transactions?${params}`,
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

  static checkTypeOperationReport(filter: any) {
    return filter.type === 'COMPANY'
      ? 'companies'
      : filter.type == 'OVERVIEW' && filter.companyIds.length > 0
      ? 'some-company'
      : 'overview';
  }

  static async getAllOperationReport(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${ReportAPIs.OPERATION_REPORT}/${ReportService.checkTypeOperationReport(
        filter
      )}?${params}`
    );
    return x?.data;
  }

  static async exportOperationReport(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${
        ReportAPIs.OPERATION_REPORT
      }/export-${ReportService.checkTypeOperationReport(filter)}?${params}`,
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
  static async getAllCustomerClassification(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${ReportAPIs.CLASIFICATION_REPORT}?${params}`
    );
    return x?.data;
  }

  static async getAllCustomerClassificationStatistics(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    const x = await axiosInstance.get(
      `${ReportAPIs.CLASIFICATION_REPORT}/classification-statistics?${params}`
    );
    return x?.data;
  }
}
