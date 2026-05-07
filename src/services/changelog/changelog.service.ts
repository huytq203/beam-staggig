import { ResponseHelpers } from '@helpers/response.helper';
import { axiosInstance } from '../api/axiosInstance';
import { ChangelogAPIs } from './apis';

export class ChangelogService {
  static async getChangeLogEmployees(filter: any, id: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    const x = await axiosInstance.get(
      decodeURIComponent(
        `${ChangelogAPIs.BASE_CHANGELOG}/employees/${id}?${params}`
      )
    );
    return x?.data?.data;
  }

  static async getListActivityLog(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    const x = await axiosInstance.get(
      decodeURIComponent(`${ChangelogAPIs.BASE_CHANGELOG}?${params}`)
    );
    return x?.data?.data;
  }

  static async getListLog(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    });
    const x = await axiosInstance.get(
      decodeURIComponent(`${ChangelogAPIs.BASE_CHANGELOG}/by-model?${params}`)
    );
    return x?.data?.data;
  }

  static async getDetailActivityLog(id: any) {
    const x = await axiosInstance.get(
      decodeURIComponent(`${ChangelogAPIs.BASE_CHANGELOG}/${id}`)
    );
    return x?.data?.data;
  }
}
