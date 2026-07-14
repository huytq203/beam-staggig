import { NEXT_PUBLIC_API_NOTIFICATION } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum NotificationManagementAPIEnums {
  TEMPLATE_NOTIFICATION = '/notification-template',
  SCHEDULE_NOTIFICATION = '/schedule-notification',
  BASE = '/notification',
  WEBSOCKET_CONNECT = '/web-notification',
}

export const NotificationManagementAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_NOTIFICATION,
  NotificationManagementAPIEnums
);
