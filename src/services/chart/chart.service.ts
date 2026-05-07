import { axiosInstance } from '../api/axiosInstance';
import { ChartAPIs } from './apis';
export class ChartService {
  static async getCashFlowChart() {
    return axiosInstance.get(`${ChartAPIs.BASE_CHART}/request-success`).then((x: any) => {
      return x?.data;
    });
  }

  static async getPayLimitChart() {
    return axiosInstance.get(`${ChartAPIs.BASE_CHART}/pay-limit-status`).then((x: any) => {
      return x?.data?.data;
    });
  }

  static async getRegisterAppChart() {
    return axiosInstance.get(`${ChartAPIs.BASE_CHART}/total-employee-register`).then((x: any) => {
      return x?.data?.data;
    });
  }
}
