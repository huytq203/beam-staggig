import { axiosInstance } from '../api/axiosInstance';
import { FileManagerAPIs } from './apis';

export class FileManagerService {
  static async getAllFiles(filter: any) {
    // const params = new URLSearchParams({
    //   ...filter,
    //   page: filter?.currentPage ? filter?.currentPage : 1,
    // }).toString()
    const x = await axiosInstance.get(`${FileManagerAPIs.BASE}${filter}`);
    return x?.data?.data;
  }
}
