import axios from 'axios';
import { axiosInstance } from '../api/axiosInstance';
import { AuthAPIs } from './apis';

export class AuthServices {
  static async login(filter: any) {
    const params = new URLSearchParams(filter).toString();
    return axiosInstance.post(`${AuthAPIs.LOGIN_ACCESS_TOKEN}`, filter);
  }

  static logout() {
    return axiosInstance.post(`${AuthAPIs.LOGOUT_ACCESS_TOKEN}`);
  }

  static resetPassword(userName: any) {
    return axiosInstance.post(`${AuthAPIs.RESET_PASSWORD}/${userName}`);
  }

  static verifyResetPasswordToken(data: any) {
    const { reset_token } = data;
    return axiosInstance.get(`${AuthAPIs.VERIFY_RESET_TOKEN}/${reset_token}`);
  }

  static changeResetPassword(data: any) {
    const { userId } = data;
    const url = AuthAPIs.RESET_CHANGE_PASSWORD.replace(':userId', userId);
    return axiosInstance.put(`${url}`, data).then((x: any) => {
      const res = x?.data?.data;
      if (res == 'SUCCESS') {
        return true;
      }
      return false;
    });
  }
  static async loginReciliation(filter: any) {
    return axiosInstance.post(`${AuthAPIs.LOGIN_RECILIATION}`, filter);
  }
}
