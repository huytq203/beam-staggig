import { axiosInstance } from '../api/axiosInstance';
import { ExpenditureAPIs } from './apis';
export class ExpenditureService {
  static async getSalaryPeriods(id: any) {
    return axiosInstance.get(`${ExpenditureAPIs.BASE_EXPENDITURE}/company/${id}/salary-periods`).then((x: any) => {
      return x?.data?.data;
    });
  }
}
