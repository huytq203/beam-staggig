import { FunctionBase } from '@helpers/fuction-base.helpers';
import { ResponseHelpers } from '@helpers/response.helper';
import { axiosInstance } from '../../api/axiosInstance';
import { CompanyTypeAPIs } from './apis';

export class CompanyTypeService {
  static getAll(filter: any) {
    const params = new URLSearchParams(FunctionBase.removeUndefinedObjectProperty(filter)).toString();

    return axiosInstance.get(`${CompanyTypeAPIs.BASE_COMPANY_TYPES}?${params}`).then((x: any) => {
      return x?.data?.data;
    });
  }

  static saveOrUpdateCompanyType(data: any) {
    const addCompanyType = (data: any) => {
      return axiosInstance.post(`${CompanyTypeAPIs.BASE_COMPANY_TYPES}`, data).then((x: any) => {
        return x?.data;
      });
    };

    const updateCompanyType = (data: any) => {
      return axiosInstance.put(`${CompanyTypeAPIs.BASE_COMPANY_TYPES}`, data).then((x: any) => {
        return x?.data;
      });
    };

    if (data?.id) {
      return updateCompanyType(data);
    }
    return addCompanyType(data);
  }

  static getCompanyType(id: any) {
    return axiosInstance.get(`${CompanyTypeAPIs.BASE_COMPANY_TYPES}/${id}`).then((x: any) => {
      return x?.data;
    });
  }
  static async removeCompanyType(id: any) {
    return axiosInstance.delete(`${CompanyTypeAPIs.BASE_COMPANY_TYPES}/${id}`);
  }
}
