import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ResponseHelpers } from '@helpers/response.helper';
import { axiosInstance } from '@services/api';
import { EmployeeAPIs } from './apis';
import { CompanyAPIs } from '../apis';

export class EmployeesServices {
  static async getListEmployeesInCompany(filter: any, companyId: any) {
    const params = new URLSearchParams({
      ...filter,
      page: filter?.page ? filter?.page : 1,
    }).toString();

    return axiosInstance
      .get(`${NEXT_PUBLIC_API_CORE}/companies/${companyId}/employees?${params}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getListEmployeesInGroup(filter: any, groupId: any) {
    const params = new URLSearchParams({
      ...filter,
      page: filter?.page ? filter?.page : 1,
    }).toString();
    const x = await axiosInstance.get(
      `${NEXT_PUBLIC_API_CORE}/employee-groups/${groupId}/employees?${params}`
    );
    return x?.data?.data;
  }

  static getCurrentProfiles(filter: any, companyId: any) {
    return axiosInstance.get(
      `${NEXT_PUBLIC_API_CORE}/companies/${companyId}/profiles/current-profile`
    );
  }

  static async getEmployeeAccount(acountId: any) {
    const x = await axiosInstance.get(
      `${EmployeeAPIs.GET_LIST_EMPLOYEES}/${acountId}`
    );
    return x?.data?.data;
  }
  static async getEmployeeAccountTemplate(id: any) {
    const x = await axiosInstance.get(
      `${CompanyAPIs.GET_LIST_COMPANY}/${id}/get-template`
    );
    return x?.data;
  }
  static addOrUpdateEmployee(data: any) {
    const addEmployee = async (data: any) => {
      const x = await axiosInstance.post(
        `${EmployeeAPIs.ADD_UPDATE_EMPLOYEES}`,
        data,
        {
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          },
        }
      );
      return x?.data;
    };

    const updateEmployee = async (data: any) => {
      const x = await axiosInstance.put(
        `${EmployeeAPIs.ADD_UPDATE_EMPLOYEES}`,
        data,
        {
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          },
        }
      );
      return x?.data;
    };

    if (data?.id) {
      return updateEmployee(data);
    }
    return addEmployee(data);
  }

  static getDetailEmployee(filter: any) {
    return axiosInstance
      .get(`${EmployeeAPIs.DETAILS_EMPLOYEES}/${filter}`)
      .then((response) => {
        return response?.data?.data;
      });
  }

  static async setActiveEmployee(id: any) {
    const x = await axiosInstance.get(
      `${EmployeeAPIs.GET_LIST_EMPLOYEES}/${id}/enable`
    );
    return x?.data?.data;
  }

  static async setInActiveEmployee(id: any) {
    const x = await axiosInstance.get(
      `${EmployeeAPIs.GET_LIST_EMPLOYEES}/${id}/disable`
    );
    return x?.data?.data;
  }

  static async enableSalaryAdvance(id: any) {
    const x = await axiosInstance.get(
      `${EmployeeAPIs.GET_LIST_EMPLOYEES}/${id}/open-salary-salary-advance`
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }

  static async disableSalaryAdvance(id: any) {
    const x = await axiosInstance.get(
      `${EmployeeAPIs.GET_LIST_EMPLOYEES}/${id}/block-salary-salary-advance`
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }

  static async enableSalaryAdvanceMultiple(data: any) {
    const x = await axiosInstance.post(
      `${EmployeeAPIs.GET_LIST_EMPLOYEES}/open-salary-salary-advance`,
      data
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }

  static async disableSalaryAdvanceMultiple(data: any) {
    const x = await axiosInstance.post(
      `${EmployeeAPIs.GET_LIST_EMPLOYEES}/block-salary-salary-advance`,
      data
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }

  static async importEmployeeWorkday(data: any, companyId: any) {
    const x = await axiosInstance.post(
      `${EmployeeAPIs.WORK_DAY}/company/${companyId}`,
      data
    );
    // if (ResponseHelpers.CheckSucessResponse(x)) {
    return x;
    // }
  }
  static async getImportEmployeeWorkdayTemplate() {
    const x = await axiosInstance.get(`${EmployeeAPIs.WORK_DAY}/template`);
    return x?.data;
  }
  static async getLogImportEmployeeWorkday(companyId: any, filter: any) {
    const params = new URLSearchParams({
      ...filter,
      page: filter?.page ? filter?.page : 1,
    }).toString();
    const x = await axiosInstance.get(
      `${EmployeeAPIs.WORK_DAY}/company/${companyId}/log?${params}`
    );
    return x?.data?.data;
  }

  static async getLogImportEmployee(companyId: any, filter: any) {
    const params = new URLSearchParams({
      ...filter,
      page: filter?.page ? filter?.page : 1,
    }).toString();
    const x = await axiosInstance.get(
      `${NEXT_PUBLIC_API_CORE}/companies/${companyId}/employee-upload-logs?${params}`
    );
    return x?.data?.data;
  }

  static async getImportEmployeeWorkdayFile(id: any) {
    const x = await axiosInstance.get(
      `${EmployeeAPIs.WORK_DAY}/log/${id}/download`
    );
    return x;
  }

  static async checkDuplicateBankAccountNumber(data: any) {
    return await axiosInstance.post(
      `${EmployeeAPIs.ADD_UPDATE_EMPLOYEES}/information/validate-alert`,
      data
    );
  }

  static async checkErrorEmployee(data: any) {
    return await axiosInstance.post(
      `${EmployeeAPIs.CHEK_ERROR_EMPLOYEE}`,
      data,
      {
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      }
    );
  }

  static async getListEmployeeFromMultipleCompany(data: any) {
    const x = await axiosInstance.post(
      `${EmployeeAPIs.GET_LIST_EMPLOYEES}/notification-scheduler/search`,
      data
    );
    if (ResponseHelpers.CheckSucessResponse(x)) {
      return x?.data;
    }
  }
}
