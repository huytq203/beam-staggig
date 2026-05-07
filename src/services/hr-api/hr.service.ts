import { axiosInstance } from '../api/axiosInstance';
import { HRAPIs } from './apis';

export class HRCompany {
  static async getHRCompanyId() {
    const x = await axiosInstance.get(`${HRAPIs.HR_COMPANY_BASE_URL}`);
    return x?.data?.data;
  }
}
