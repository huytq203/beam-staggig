import { axiosInstance } from '../api/axiosInstance';
import { UserAPIs } from './apis';

export class UserSevice {
  static getAll(filter: any) {
    const params = new URLSearchParams({
      ...filter,
      page: filter?.currentPage ? filter?.currentPage : 1,
    }).toString();
    return axiosInstance
      .get(`${UserAPIs.GET_LIST_ALL_USER}?${params}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  // static addOrUpdateUser(data: any, userId?: any) {
  //   if (userId) {
  //     return this.updateUser(data, userId);
  //   } else {
  //     return this.addUser(data);
  //   }
  // }

  static addUser(data: any) {
    return axiosInstance.post(UserAPIs.ADD_USER, data);
  }

  // static updateUser(data: any, userId: any) {
  //   return axiosInstance.put(`${UserAPIs.ADD_USER}/${userId}`, data);
  // }

  static getUser(id: any) {
    return axiosInstance.get(`${UserAPIs.ADD_USER}/${id}`).then((x: any) => {
      return x?.data;
    });
  }

  static async resetPasswordUser(password: any) {
    return axiosInstance
      .put(`${UserAPIs.BASE_URL}/my-password`, password)
      .then((x: any) => {
        return x?.data;
      });
  }

  static async getUserRoles(userId: any) {
    const data = await axiosInstance.get(
      `${UserAPIs.BASE_PATH}/${userId}/get-roles`
    );
    return data?.data?.data;
  }

  static assignRole(userId: any, data: any) {
    return axiosInstance.post(
      `${UserAPIs.BASE_PATH}/${userId}/assign-roles`,
      data
    );
  }

  static async getAllBeamAdmin(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(`${UserAPIs.BEAM_ADMIN}/list?${params}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }
  static async getAllHRAdmin(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(`${UserAPIs.HR_ADMIN}/list?${params}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }
  static async getAllHRAdminCompany(filter: any, companyId: any) {
    const params = new URLSearchParams({
      ...filter,
      companyId: companyId,
    }).toString();
    return axiosInstance
      .get(`${UserAPIs.HR_ADMIN}/company/list?${params}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }
  static async getAllUser(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(`${UserAPIs.USER}/list?${params}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }
  static async saveAdmin(adminRequest: any) {
    return axiosInstance
      .post(`${UserAPIs.BEAM_ADMIN}`, adminRequest)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async updateAdmin(adminRequest: any) {
    return axiosInstance
      .put(`${UserAPIs.BEAM_ADMIN}`, adminRequest)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async saveHRAdmin(hrRequest: any) {
    return axiosInstance
      .post(`${UserAPIs.HR_ADMIN}`, hrRequest)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async updateHRAdmin(hrRequest: any) {
    return axiosInstance
      .put(`${UserAPIs.HR_ADMIN}`, hrRequest)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async saveUser(userRequest: any) {
    return axiosInstance
      .post(`${UserAPIs.BASE_URL}/user`, userRequest)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async updateUser(userRequest: any) {
    return axiosInstance
      .put(`${UserAPIs.BASE_URL}/user`, userRequest)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async updateAccountInformation(userRequest: any) {
    return axiosInstance
      .put(`${UserAPIs.BASE_URL}/information`, userRequest)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async resetPassword(passwordRequest: any) {
    return axiosInstance
      .post(`${UserAPIs.BASE_URL}/password/reset`, passwordRequest)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async getResetPasswordByLink(userName: any) {
    return axiosInstance
      .get(`${UserAPIs.BASE_URL}/password/reset-link/${userName}`)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async resetPasswordByLink(passwordRequest: any) {
    return axiosInstance
      .post(`${UserAPIs.BASE_URL}/password/reset-by-link`, passwordRequest)
      .then((x: any) => {
        return x?.data;
      });
  }
  static async checkResetPasswordByLink(passwordRequest: any) {
    return axiosInstance
      .post(
        `${UserAPIs.BASE_URL}/password/check-reset-by-link`,
        passwordRequest
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }
  static async getAdmin(username: any) {
    return axiosInstance
      .get(`${UserAPIs.BASE_URL}/${username}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }
  static async getHRAdmin(username: any) {
    return axiosInstance
      .get(`${UserAPIs.HR_ADMIN}/${username}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }
  static async getListActivityLogUser(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    const x = await axiosInstance.get(
      decodeURIComponent(`${UserAPIs.BASE_CHANGE_LOG_USER}?${params}`)
    );
    return x?.data?.data;
  }

  static async getDetailActivityLogUser(id: any) {
    const x = await axiosInstance.get(
      decodeURIComponent(`${UserAPIs.BASE_CHANGE_LOG_USER}/${id}`)
    );
    return x?.data?.data;
  }
}
