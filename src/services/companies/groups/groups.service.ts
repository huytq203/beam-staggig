import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { axiosInstance } from '@services/api';
import { GroupsAPIs } from './apis';

export class GroupsServices {
  static async getListGroupsInComany(filter: any, companyId: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    return axiosInstance
      .get(
        `${NEXT_PUBLIC_API_CORE}/companies/${companyId}/employee-groups?${params}`
      )
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async removeGroupInCompany(id: any) {
    return axiosInstance.delete(`${GroupsAPIs.BASE_GROUP}/${id}`);
  }

  static onSaveOrUpdateGroup(groupRequest: any) {
    const saveGroup = (request: any) => {
      return axiosInstance
        .post(`${GroupsAPIs.BASE_GROUP}`, request)
        .then((x: any) => {
          return x?.data;
        });
    };

    const updateGroup = (request: any) => {
      return axiosInstance
        .put(`${GroupsAPIs.BASE_GROUP}`, request)
        .then((x: any) => {
          return x?.data;
        });
    };

    if (groupRequest?.id) {
      return updateGroup(groupRequest);
    }
    return saveGroup(groupRequest);
  }

  static getGroup(groupId: any) {
    return axiosInstance
      .get(`${GroupsAPIs.BASE_GROUP}/${groupId}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static updateGroup(filter: any) {
    return axiosInstance.put(`${GroupsAPIs.BASE_GROUP}`, filter);
  }
}
