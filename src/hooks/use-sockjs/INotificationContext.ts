import * as React from 'react';

export interface INotificationContext {
  notifications: any;
  refetch: any;
  isLoading: any;
  isFetching: any;
  fetchNextPage: any;
  isFetchingNextPage: any;
  hasNextPage: any;
}

export const NotificationContext = React.createContext<INotificationContext>(
  {} as INotificationContext
);
