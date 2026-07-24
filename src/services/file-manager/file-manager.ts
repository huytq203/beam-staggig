import { axiosInstance } from '../api/axiosInstance';
import { resolveFileManagerUrl } from './apis';

export class FileManagerService {
  static async getAllFiles(filter: any) {
    // news -> /api/news/get-all (route mới), còn lại -> ${API_CORE}/file-manager/... (BE cũ)
    const x = await axiosInstance.get(resolveFileManagerUrl(filter));
    return x?.data?.data;
  }
}
