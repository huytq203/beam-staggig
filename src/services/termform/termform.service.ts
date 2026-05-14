import { axiosInstance } from '../api/axiosInstance';
import { TermFormAPIs } from './apis';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { ResponseHelpers } from '@helpers/response.helper';

export class TermFormTypeService {
  static async getAll(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(`${TermFormAPIs.TERMS_FORM}?${params}`);
    return x?.data?.data;
  }

  static async getlistTermContract(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(`${TermFormAPIs.TERMS_OF_CONTRACT}?${params}`);
    return x?.data?.data;
  }

  

  static async removeTermForm(id: any) {
    return axiosInstance.delete(`${TermFormAPIs.TERMS_FORM}/${id}`);
  }

  static getTermForm(id: any) {
    return axiosInstance
      .get(`${TermFormAPIs.TERMS_FORM}/${id}`)
      .then((x: any) => {
        return x?.data;
      });
  }

  static saveOrUpdateTermForm(data: any) {
    const addTermForm = (data: any) => {
      return axiosInstance
        .post(`${TermFormAPIs.TERMS_FORM}`, data)
        .then((x: any) => {
          return x?.data;
        });
    };
    const updateTermForm = (data: any) => {
      return axiosInstance
        .put(`${TermFormAPIs.TERMS_FORM}/${data.id}`, data)
        .then((x: any) => {
          return x?.data;
        });
    };
    if (data?.id) {
      return updateTermForm(data);
    }
    return addTermForm(data);
  }

  static async activateTermForm(id: any) {
    const x = await axiosInstance.post(
      `${TermFormAPIs.TERMS_FORM}/${id}/status-term-form/activate`
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }

  static async deactivateTermForm(id: any) {
    const x = await axiosInstance.post(
      `${TermFormAPIs.TERMS_FORM}/${id}/status-term-form/deactivate`
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }

  static async activateEndUser(id: any) {
    const x = await axiosInstance.post(
      `${TermFormAPIs.TERMS_FORM}/${id}/end-user/activate`
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }
  static async deactivateEndUser(id: any) {
    const x = await axiosInstance.post(
      `${TermFormAPIs.TERMS_FORM}/${id}/end-user/deactivate`
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }

  static addOrUpdate(requestObject: any) {
    return axiosInstance
      .post(
        `${TermFormAPIs.TERMS_FORM}/${requestObject.idTermForm}/apply-company`,
        requestObject
      )
      .then((x: any) => {
        const response = x?.data;
        if (response) {
          const { code: responseCode, message } = response;
          if (responseCode == 200 && message == 'OK') {
            return true;
          }
        }
        return false;
      });
  }

  static async listApplyCompany(companyId: any) {
    const x = await axiosInstance.get(
      `${TermFormAPIs.TERMS_FORM}/${companyId}/apply-company`
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }
}
