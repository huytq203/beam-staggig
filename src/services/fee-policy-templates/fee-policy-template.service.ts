import { ObjectHelper } from '@helpers/object.helper';
import { axiosInstance } from '../api/axiosInstance';
import { FeePolicyTemplateAPIs } from './apis';

export class FeePolicyTemplateService {
  static getAll(filter: any) {
    const params = ObjectHelper.getParamsFilter(filter);
    return axiosInstance.get(`${FeePolicyTemplateAPIs.GET_LIST_FEE_POLICY}?${params}`).then((x: any) => {
      return x?.data?.data;
    });
  }
  static async removeTemplateFee(id: any) {
    return axiosInstance.delete(`${FeePolicyTemplateAPIs.GET_LIST_FEE_POLICY}/${id}`);
  }
  static saveOrUpdateFeePolicy(request: any) {
    const saveTemplateFee = (FTRequest: any) => {
      return axiosInstance.post(`${FeePolicyTemplateAPIs.GET_LIST_FEE_POLICY}`, FTRequest).then((x: any) => {
        const response = x?.data;
        if (response) {
          const { code: responseCode, message } = response;
          if (responseCode == 200 && message == 'OK') {
            return true;
          }
        }
        return false;
      });
    };

    const updateTemplateFee = (updateRequest: any) => {
      return axiosInstance.put(`${FeePolicyTemplateAPIs.GET_LIST_FEE_POLICY}`, updateRequest).then((x: any) => {
        const response = x?.data;
        if (response) {
          const { code: responseCode, message } = response;
          if (responseCode == 200 && message == 'OK') {
            return true;
          }
        }
        return false;
      });
    };

    if (request?.id) {
      return updateTemplateFee(request);
    }
    return saveTemplateFee(request);
  }

  static getFeePolicy(groupId: any) {
    return axiosInstance.get(`${FeePolicyTemplateAPIs.GET_LIST_FEE_POLICY}/${groupId}`).then((x: any) => {
      return x?.data?.data;
    });
  }
}
