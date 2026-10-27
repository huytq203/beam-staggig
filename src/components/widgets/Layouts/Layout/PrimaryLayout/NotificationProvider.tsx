import { USE_SHARED_NOTIFICATION } from '@constants/endpoints';
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
import { useInfiniteQuery } from 'react-query';

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
  const newestNotification = React.useRef<{ owner: string; ids: Set<string>; time: number } | null>(null);
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
    ['notifications', profile?.username ?? 'current'],
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
      enabled: Boolean(token && profile?.username) && !checkExceptUrl(),
      refetchOnWindowFocus: USE_SHARED_NOTIFICATION,
      refetchInterval: USE_SHARED_NOTIFICATION ? 15_000 : false,
      refetchIntervalInBackground: false,
      getNextPageParam: (lastPage: any, allPage: any) => {
        const page = lastPage?.notifications;
        if (!page || page.last || allPage.length >= page.totalPages) return undefined;
        return allPage.length + 1;
      },
    }
  );
  const onSeenNotification = async (notificationId: any) => {
    await NotificationManagementService.seenNotification(notificationId);
    await reFetchNotification();
  };
  const onViewNotification = async (notificationId: any, data: any) => {
    if (!data) {
      await onSeenNotification(notificationId);
      return;
    }
    const companyId = data?.data?.companyId;
    const employeeId = data?.data?.employeeId;
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
    if (!USE_SHARED_NOTIFICATION && token && !checkExceptUrl()) {
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
      if (!USE_SHARED_NOTIFICATION && token) {
        unsubscribe(subscriptionRef.current);
        disconnect();
      }
    };
  }, [token, router.route]);

  // Shared ECS service exposes authenticated REST. Poll only while visible;
  // notifications already present at mount never trigger historical popups.
  React.useEffect(() => {
    if (!USE_SHARED_NOTIFICATION) return;
    if (!token || !profile?.username) {
      newestNotification.current = null;
      return;
    }
    if (!dataNotifications?.pages?.[0]) return;
    const owner = String(profile?.username ?? '');
    const items = dataNotifications?.pages?.[0]?.notifications?.content ?? [];
    if (!Array.isArray(items)) return;
    const previous = newestNotification.current;
    const latestTime = items.reduce((latest: number, item: any) =>
      Math.max(latest, Date.parse(item.createdAt ?? '') || 0),
      previous?.owner === owner ? previous.time : 0);
    if (previous && previous.owner === owner) {
      for (const item of items) {
        if (!item.id || previous.ids.has(item.id) ||
            (Date.parse(item.createdAt ?? '') || 0) <= previous.time) continue;
        let payload = null;
        try {
          payload = typeof item.body === 'string' ? JSON.parse(item.body) : item.body;
        } catch (_) {}
        Notification.info({
          title: item.title,
          content: item.message,
          onClick: () => onViewNotification(item.id, payload),
        });
      }
    }
    newestNotification.current = {
      owner,
      ids: new Set(items.map((item: any) => String(item.id))),
      time: latestTime,
    };
  }, [dataNotifications, token, profile?.username]);

  const provider: INotificationContext = {
    notifications: token && profile?.username ? dataNotifications : undefined,
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
