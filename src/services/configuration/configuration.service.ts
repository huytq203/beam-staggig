import { FunctionBase } from '@helpers/fuction-base.helpers';
import { axiosInstance } from '../api/axiosInstance';
import { ConfigurationAPIs } from './apis';

export class ConfigurationService {
  static async getBasicConfiguration() {
    const x = await axiosInstance.get(
      `${ConfigurationAPIs.BASIC_CONFIGURATION}`
    );
    return x?.data;
  }

  static disableBasicConfig(basicConfigRequest: any) {
    return axiosInstance
      .put(`${ConfigurationAPIs.BASIC_CONFIGURATION}`, basicConfigRequest)
      .then((x: any) => {
        if (x === undefined) return false;
        const response = x?.data;
        const { code: responseCode, message } = response;
        if (responseCode == 200 && message == 'OK') {
          return true;
        }
        return false;
      });
  }

  static async getAdvanceConfigurationByType(type: any) {
    const x = await axiosInstance.get(
      `${ConfigurationAPIs.ADVANCE_CONFIGURATION}/${type}`
    );
    return x?.data;
  }

  static async getAdvanceConfigurationByRecord(type: any, recordId: any) {
    const x = await ConfigurationService.getAdvanceConfigurationByType(type);
    const record = await x?.data?.filter((data: any) => data?.id === recordId);
    return record;
  }

  static baseAdvanceConfig(advanceConfigRequest: any) {
    return axiosInstance
      .put(`${ConfigurationAPIs.ADVANCE_CONFIGURATION}`, advanceConfigRequest)
      .then((x: any) => {
        if (x === undefined) return false;
        const response = x?.data;
        const { code: responseCode, message } = response;
        if (responseCode == 200 && message == 'OK') {
          return true;
        }
        return false;
      });
  }
  static async getAdvanceReceiverConfiguration(id: any) {
    const x = await axiosInstance.get(
      `${ConfigurationAPIs.ADVANCE_RECEIVER_CONFIGURATION}/${id}`
    );
    return x?.data;
  }
  static advanceReceiverConfig(advanceReceiverConfigRequest: any) {
    return axiosInstance
      .put(
        `${ConfigurationAPIs.ADVANCE_RECEIVER_CONFIGURATION}`,
        advanceReceiverConfigRequest
      )
      .then((x: any) => {
        if (x === undefined) return false;
        const response = x?.data;
        const { code: responseCode, message } = response;
        if (responseCode == 200 && message == 'OK') {
          return true;
        }
        return false;
      });
  }
  static async getTransferFee(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    const x = await axiosInstance.get(
      `${ConfigurationAPIs.TRANSFER_FEE}?${params}`
    );
    return x?.data;
  }
  static async getTransferType(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${ConfigurationAPIs.TRANSFER_TYPE}?${params}`
    );
    return x?.data;
  }
  static async getTransferFeeById(id: any) {
    return axiosInstance
      .get(`${ConfigurationAPIs.TRANSFER_FEE}/${id}`)
      .then((x: any) => {
        return x?.data;
      });
  }
  static saveOrUpdateTransfer(transferRequest: any) {
    const saveTransfer = (request: any) => {
      return axiosInstance.post(
        `${ConfigurationAPIs.TRANSFER_FEE}`,
        transferRequest
      );
    };

    const updateTransfer = (request: any) => {
      return axiosInstance.put(
        `${ConfigurationAPIs.TRANSFER_FEE}`,
        transferRequest
      );
    };
    if (transferRequest?.id) {
      return updateTransfer(transferRequest).then((x: any) => {
        return x?.data;
      });
    }
    return saveTransfer(transferRequest).then((x: any) => {
      return x?.data;
    });
  }
  static async getListAllEmpConfig(filter: any) {
    const params = new URLSearchParams({
      ...filter,
      page: filter?.page ? filter?.page : 1,
    }).toString();
    const x = await axiosInstance.get(
      `${ConfigurationAPIs.EMPLOYEE_CONFIG}?${params}`
    );
    return x?.data;
  }
}
