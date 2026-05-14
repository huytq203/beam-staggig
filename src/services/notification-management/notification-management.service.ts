import { ObjectHelper } from '@helpers/object.helper';
import { axiosInstance } from '../api/axiosInstance';
import { NotificationManagementAPIs } from './apis';

export class NotificationManagementService {
  static async getAll(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    const x = await axiosInstance.get(
      `${NotificationManagementAPIs.TEMPLATE_NOTIFICATION}?${params}`
    );
    return x?.data?.data;
  }
  static async getDetailNotification(id: any) {
    return axiosInstance
      .get(`${NotificationManagementAPIs.TEMPLATE_NOTIFICATION}/${id}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getAllSchedule(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    const x = await axiosInstance.get(
      `${NotificationManagementAPIs.SCHEDULE_NOTIFICATION}?${params}`
    );

    return x?.data?.data;
  }
  static async getDetailScheduleNotification(id: any) {
    return axiosInstance
      .get(`${NotificationManagementAPIs.SCHEDULE_NOTIFICATION}/${id}`)
      .then((x: any) => {
        return x?.data?.data;
      });
  }

  static async getNotificationByType(data: any) {
    const params = ObjectHelper.getParamsFilter(data);
    const x = await axiosInstance.post(
      `${NotificationManagementAPIs.TEMPLATE_NOTIFICATION}/by-type?${params}`,
      data
    );
    return x?.data?.data;
  }
  static async addOrUpdateNotification(data: any) {
    const x = await axiosInstance.put(
      `${NotificationManagementAPIs.TEMPLATE_NOTIFICATION}`,
      data
    );
    const response = x?.data;
    if (
      (response?.code == 200 && response?.message == 'OK') ||
      (response?.code == 200 && response?.message == 'SUCCESS')
    ) {
      return true;
    }
    return false;
  }

  static addOrUpdateScheduleNotification(data: any) {
    const addScheduleNotification = (data: any) => {
      return axiosInstance
        .post(`${NotificationManagementAPIs.SCHEDULE_NOTIFICATION}`, data)
        .then((x: any) => {
          return x?.data;
        });
    };

    const updateScheduleNotification = (data: any) => {
      return axiosInstance
        .put(
          `${NotificationManagementAPIs.SCHEDULE_NOTIFICATION}/update-info`,
          data
        )
        .then((x: any) => {
          return x?.data;
        });
    };

    if (data?.id) {
      return updateScheduleNotification(data);
    }
    return addScheduleNotification(data);
  }

  static async getMyNotificationList(filter: any) {
    const params = new URLSearchParams({
      ...filter,
    }).toString();
    const x = await axiosInstance.post(
      `${NotificationManagementAPIs.BASE}/get-my-notification?${params}`
    );
    return x?.data?.data;
  }

  static async seenAllNotification() {
    const x = await axiosInstance.get(
      `${NotificationManagementAPIs.BASE}/check-seen-all`
    );
    return x?.data?.data;
  }

  static async viewAllNotification() {
    const x = await axiosInstance.get(
      `${NotificationManagementAPIs.BASE}/check-view-all`
    );
    return x?.data?.data;
  }

  static async seenNotification(notificationId: any) {
    const x = await axiosInstance.get(
      `${NotificationManagementAPIs.BASE}/check-seen/${notificationId}`
    );
    return x?.data?.data;
  }

  static async connectWebSocket() {
    const x = await axiosInstance.get(
      `${NotificationManagementAPIs.BASE}/web-notification`
    );
    return x?.data?.data;
  }
}
