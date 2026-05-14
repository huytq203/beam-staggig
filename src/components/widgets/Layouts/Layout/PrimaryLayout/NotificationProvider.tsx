import { NotificationEnum } from '@constants/notification.constants';
import { notificationConfigs } from '@constants/notificationConfis.constants';
import { useAuth } from '@contexts/authentication';
import { Notification } from '@douyinfe/semi-ui';
import { useSockJs } from '@hooks/use-sockjs';
import {
  INotificationContext,
  NotificationContext,
} from '@hooks/use-sockjs/INotificationContext';
import { NotificationManagementService } from '@services/notification-management';
import { NotificationManagementAPIs } from '@services/notification-management/apis';
import { Frame } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';

interface Props {
  onError?: (error: Frame | string) => any;
}

export const NotificationProvider: React.FunctionComponent<any> = ({
  onError: globalErrorHandler,
  children,
}) => {
  const { profile } = useAuth();
  const { connect, disconnect, subscribe, unsubscribe } = useSockJs();

  const token = Cookies.get('ACCESS_TOKEN') ?? null;
  const subscriptionRef = React.useRef<any | null>(null);
  const router = useRouter();

  const exceptUrl = ['/privacyPolicy', '/landing-page-report'];
  const checkExceptUrl = () => {
    let url = '';
    if (typeof router.asPath == 'string') {
      url = router.route;
    }
    return exceptUrl.includes(url);
  };
  const {
    data: dataNotifications,
    isLoading: isLoadingNotification,
    isFetching: isFetchingNotification,
    refetch: reFetchNotification,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['notifications'],
    (pageParam) => {
      if (token != null) {
        const noti = NotificationManagementService.getMyNotificationList({
          page: pageParam?.pageParam ? pageParam?.pageParam : 1,
          size: 20,
        });
        return noti;
      }
    },
    {
      enabled: !checkExceptUrl(),
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
      getNextPageParam: (lastPage: any, allPage: any) => {
        return allPage.length + 1;
      },
    }
  );
  const onSeenNotification = async (notificationId: any) => {
    const response = await NotificationManagementService.seenNotification(
      notificationId
    );
  };
  const onViewNotification = async (notificationId: any, data: any) => {
    if (!data) return;
    const companyId = data?.data.companyId;
    const employeeId = data?.data.employeeId;
    const profileId = data?.data?.profileId ? data?.data?.profileId : null;
    const startTime = data?.data?.startTime ? data?.data?.startTime : null;
    const endTime = data?.data?.endTime ? data?.data?.endTime : null;
    const feePolicyId = data?.data?.feePolicyId
      ? data?.data?.feePolicyId
      : null;
    const phoneNumber = data?.data?.phoneNumber
      ? data?.data?.phoneNumber
      : null;
    const { type, id: ticketId } = data;
    const notificationConfig = notificationConfigs.find(
      (x: any) => x.type == type
    );
    notificationConfig?.onAction({
      ticketId: ticketId,
      type: type,
      companyId: companyId,
      profileId: profileId,
      endTime: endTime,
      startTime: startTime,
      employeeId: employeeId,
      phoneNumber: phoneNumber,
      feePolicyId: feePolicyId,
    });
    await onSeenNotification(notificationId);
  };

  React.useEffect(() => {
    if (token && !checkExceptUrl()) {
      connect({
        url: `${NotificationManagementAPIs.WEBSOCKET_CONNECT}?token=${token}`,
        heartbeat: {
          incoming: 600000,
          outgoing: 600000,
        },
        onConnected(client) {
          subscribe({
            destination: '/user/receive/new-notification',
            onMessage: (message) => {
              const responseData = JSON.parse(message.body);
              let responseSetting: any = null;
              try {
                responseSetting = JSON.parse(responseData.body);
              } catch (e) {
                responseSetting = null;
              }
              Notification.info({
                title: responseData?.title,
                content: responseData?.message,
                onClick: () => {
                  return onViewNotification(responseData.id, responseSetting);
                },
              });
              reFetchNotification();
            },
            onSubscribed: (subscription) => {
              subscriptionRef.current = subscription;
            },
          });
        },
      });
    }

    return () => {
      if (token) {
        unsubscribe(subscriptionRef);
        disconnect();
      }
    };
  }, []);

  const provider: INotificationContext = {
    notifications: dataNotifications,
    refetch: reFetchNotification,
    isLoading: isLoadingNotification,
    isFetching: isFetchingNotification,
    fetchNextPage: fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };

  return (
    <NotificationContext.Provider value={provider}>
      {children}
    </NotificationContext.Provider>
  );
};
