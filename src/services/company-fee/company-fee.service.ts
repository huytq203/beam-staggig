import { axiosInstance } from '../api/axiosInstance';
import { CompanyFeePolicyAPIs } from './apis';

export class CompanyFeePolicyService {
  static async assignToCompanies(request: any) {
    const x = await axiosInstance.post(
      `${CompanyFeePolicyAPIs.COMPANY_FEE_BASE_URL}`,
      request
    );
    const response = x?.data;
    if (response) {
      const { code: responseCode, message } = response;
      if (responseCode == 200 && message == 'OK') {
        return true;
      }
    }
    return false;
  }

  static async assignFPToOneCompany(request: any, companyId: any) {
    const x = await axiosInstance.post(
      `${CompanyFeePolicyAPIs.COMPANY_FEE_BASE_URL}/${companyId}`,
      request
    );
    const response = x?.data;
    if (response) {
      const { code: responseCode, message } = response;
      if (responseCode == 200 && message == 'OK') {
        return true;
      }
    }
    return false;
  }

  static async removeCompanyFromFeePolicy(request: any) {
    const x = await axiosInstance.post(
      `${CompanyFeePolicyAPIs.DELETE_COMPANY_FEE}`,
      request
    );
    const response = x?.data;
    if (response) {
      const { code: responseCode, message } = response;
      if (responseCode == 200 && message == 'OK') {
        return true;
      }
    }
    return false;
  }

  static async getFeePolicy(groupId: any) {
    const x = await axiosInstance.get(
      `${CompanyFeePolicyAPIs.COMPANY_FEE_BASE_URL}/${groupId}`
    );
    return x?.data?.data;
  }
}
