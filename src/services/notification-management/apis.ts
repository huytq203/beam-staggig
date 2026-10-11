import { NEXT_PUBLIC_API_NOTIFICATION, NEXT_PUBLIC_API_NOTIFICATION_MANAGEMENT } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum NotificationManagementAPIEnums {
  TEMPLATE_NOTIFICATION = '/notification-template',
  SCHEDULE_NOTIFICATION = '/schedule-notification',
  BASE = '/notification',
  WEBSOCKET_CONNECT = '/web-notification',
}

export const NotificationManagementAPIs = {
  ...ApiHelper.getListUri(NEXT_PUBLIC_API_NOTIFICATION_MANAGEMENT, {
    TEMPLATE_NOTIFICATION: NotificationManagementAPIEnums.TEMPLATE_NOTIFICATION,
    SCHEDULE_NOTIFICATION: NotificationManagementAPIEnums.SCHEDULE_NOTIFICATION,
  }),
  ...ApiHelper.getListUri(NEXT_PUBLIC_API_NOTIFICATION, {
    BASE: NotificationManagementAPIEnums.BASE,
    WEBSOCKET_CONNECT: NotificationManagementAPIEnums.WEBSOCKET_CONNECT,
  }),
};
