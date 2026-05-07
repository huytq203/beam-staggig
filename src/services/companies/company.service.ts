import { FunctionBase } from '@helpers/fuction-base.helpers';
import { ResponseHelpers } from '@helpers/response.helper';
import { axiosInstance } from '../api/axiosInstance';
import { CompanyAPIs } from './apis';

export class CompanyService {
  static async getAll(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();

    const x = await axiosInstance.get(
      `${CompanyAPIs.GET_LIST_COMPANY}?${params}`
    );
    return x?.data?.data;
  }

  static async getListFeePolicyFromCompany(companyId: any, filter: any) {
    const params = new URLSearchParams(filter).toString();

    const x = await axiosInstance.get(
      `${CompanyAPIs.GET_LIST_COMPANY}/${companyId}/company-fees?${params}`
    );
    return x?.data?.data;
  }

  static async saveOrUpdateCompany(companyRequest: any) {
    const saveCompany = (request: any) => {
      return axiosInstance.post(
        `${CompanyAPIs.GET_LIST_COMPANY}`,
        companyRequest
      );
    };

    const updateCompany = (request: any) => {
      return axiosInstance.put(
        `${CompanyAPIs.GET_LIST_COMPANY}`,
        companyRequest
      );
    };
    if (companyRequest?.id) {
      const x = await updateCompany(companyRequest);
      return x?.data;
    }
    const x_1 = await saveCompany(companyRequest);
    return x_1?.data;
  }

  static disableCompany(id: string) {
    return axiosInstance
      .get(`${CompanyAPIs.GET_LIST_COMPANY}/${id}/disable`)
      .then((x: any) => {
        if (ResponseHelpers.CheckSucessResponse(x)) {
          return x?.data;
        }
      });
  }

  static async enableCompany(id: string) {
    const x = await axiosInstance.get(
      `${CompanyAPIs.GET_LIST_COMPANY}/${id}/enable`
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }

  static async blockCompany(data: any) {
    const x = await axiosInstance.post(`${CompanyAPIs.BLOCK_COMPANY}`, data);
    return x?.data;
  }

  static async unBlockCompany(id: any) {
    const x = await axiosInstance.post(`${CompanyAPIs.UNBLOCK_COMPANY}`, id);
    return x?.data;
  }

  static async getListProfile(id: number, filter: any) {
    const params = new URLSearchParams(filter).toString();

    const x = await axiosInstance.get(
      `${CompanyAPIs.GET_LIST_COMPANY}/${id}/profiles?${params}`
    );
    return x?.data?.data;
  }

  static async getCompany(id: any) {
    return await axiosInstance
      .get(`${CompanyAPIs.GET_LIST_COMPANY}/${id}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getProfile(id: any) {
    const x = await axiosInstance.get(`${CompanyAPIs.BASE_PROFILE}/${id}`);
    return x?.data?.data;
  }

  static async setActiveProfile(id: any) {
    const x = await axiosInstance.get(
      `${CompanyAPIs.BASE_PROFILE}/${id}/enable`
    );
    return x?.data?.data;
  }

  static async setInActiveProfile(id: any) {
    const x = await axiosInstance.get(
      `${CompanyAPIs.BASE_PROFILE}/${id}/disable`
    );
    return x?.data?.data;
  }

  static getCurrentProfile(id: any) {
    return axiosInstance
      .get(`${CompanyAPIs.GET_LIST_COMPANY}/${id}/profiles/current-profile`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async checkOverlapProfile(profileRequest: any) {
    const x = await axiosInstance.post(
      `${CompanyAPIs.BASE_PROFILE}/check-overlap`,
      profileRequest
    );
    if (x?.data?.data) {
      return true;
    }
    return false;
  }

  static saveOrUpdateProfile(profileRequest: any) {
    const saveProfile = async (request: any) => {
      const x = await axiosInstance.post(
        `${CompanyAPIs.BASE_PROFILE}`,
        profileRequest
      );
      const response = x?.data;
      if (response) {
        const { code: responseCode, message } = response;
        if (responseCode == 200 && message == 'OK') {
          return true;
        }
      }
      return false;
    };

    const updateProfile = async (request: any) => {
      const x = await axiosInstance.put(
        `${CompanyAPIs.BASE_PROFILE}`,
        profileRequest
      );
      const response = x?.data;
      if (response) {
        const { code: responseCode, message } = response;
        if (responseCode == 200 && message == 'OK') {
          return true;
        }
      }
      return false;
    };
    if (profileRequest?.id) {
      return updateProfile(profileRequest);
    }
    return saveProfile(profileRequest);
  }

  static async assignHR(companyId: any, userId: any) {
    const x = await axiosInstance.post(
      `${CompanyAPIs.GET_LIST_COMPANY}/${companyId}/hr?userId=${userId}`
    );
    return x?.data?.data;
  }

  static async getHrUserCompany(userId: any) {
    const x = await axiosInstance.get(`${CompanyAPIs.HR_COMPANY}/${userId}`);
    return x?.data?.data;
  }

  static async checkAvailabilityTaxNumber(data: any) {
    return await axiosInstance.post(
      `${CompanyAPIs.CHECK_AVAILABILITY_TAX_NUMBER}`,
      data
    );
  }

  static async getCompanyFeePolicy(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();

    const x = await axiosInstance.get(
      `${CompanyAPIs.GET_LIST_COMPANY_FEE}?${params}`
    );
    return x?.data?.data;
  }

  static async exportEmployeeFromCompanyId(companyId: any, filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();
    const x = await axiosInstance.get(
      `${CompanyAPIs.GET_LIST_COMPANY}/${companyId}/employees/export?${params}`,
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

  static async exportEmployeeOPSFromCompanyId(companyId: any) {
    const x = await axiosInstance.get(
      `${CompanyAPIs.GET_LIST_COMPANY}/${companyId}/employees/export-ops`,
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

  static async importEmployeeFromCompanyId(
    data: any,
    companyId: any,
    updateForNewPeriod: any
  ) {
    const x = await axiosInstance.post(
      `${CompanyAPIs.GET_LIST_COMPANY}/${companyId}/employees/upload-employees`,
      data,
      {
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      }
    );
    // if (ResponseHelpers.CheckSucessResponse(x)) {
    return x;
    // }
  }

  // static async getPayLimitCompany(companyId: any) {
  //   const x = await axiosInstance.get(
  //     `${CompanyAPIs.GET_PAY_LIMIT}/${companyId}`
  //   );
  //   return x?.data?.data;
  // }

  static async getAllCompaniesDropdown(filter: any) {
    const params = new URLSearchParams(
      FunctionBase.removeUndefinedObjectProperty(filter)
    ).toString();

    const x = await axiosInstance.get(
      `${CompanyAPIs.GET_LIST_COMMON}/dropdown/companies?${params}`
    );
    return x?.data?.data;
  }
  static async getTransactionInfo(companyId: any) {
    const x = await axiosInstance.get(
      `${CompanyAPIs.GET_LIST_COMPANY}/${companyId}/transactions-info`
    );
    return x?.data?.data;
  }
}
