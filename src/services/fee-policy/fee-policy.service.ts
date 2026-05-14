import { axiosInstance } from '../api/axiosInstance';
import { FeePolicyAPIs } from './apis';

export class FeePolicyService {
  static async getAll(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(`${FeePolicyAPIs.FEE_POLICY_BASE_URL}?${params}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async saveOrUpdateFeePolicy(request: any) {
    const saveTemplateFee = async (FTRequest: any) => {
      const x = await axiosInstance.post(
        `${FeePolicyAPIs.FEE_POLICY_BASE_URL}`,
        FTRequest
      );
      const response = x?.data;
      if (response) {
        const { code: responseCode, message, data: resData } = response;
        if (responseCode == 200 && message == 'OK') {
          return resData?.id;
        }
      }
      return false;
    };

    const updateTemplateFee = async (updateRequest: any) => {
      const x = await axiosInstance.put(
        `${FeePolicyAPIs.FEE_POLICY_BASE_URL}`,
        updateRequest
      );
      const response = x?.data;
      if (response) {
        const { code: responseCode, message } = response;
        if (responseCode == 200 && message == 'OK') {
          return response?.data?.id;
        }
      }
      return false;
    };

    if (request?.id) {
      return updateTemplateFee(request);
    }
    return saveTemplateFee(request);
  }

  static async getFeePolicy(groupId: any) {
    return axiosInstance
      .get(`${FeePolicyAPIs.FEE_POLICY_BASE_URL}/${groupId}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async updateStatus(feePolicyId: any, status: number) {
    return axiosInstance
      .get(
        `${FeePolicyAPIs.FEE_POLICY_BASE_URL}/${feePolicyId}/update-status?status=${status}`
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getListAssignedCompany(feePolicyId: any) {
    const x = await axiosInstance.get(
      `${FeePolicyAPIs.FEE_POLICY_BASE_URL}/${feePolicyId}/company`
    );
    return x?.data?.data;
  }

  static async getCompaniesOverlapFP(request: any) {
    const x = await axiosInstance.post(
      `${FeePolicyAPIs.FEE_POLICY_BASE_URL}/check-overlap`,
      request
    );
    return x?.data?.data;
  }
}
