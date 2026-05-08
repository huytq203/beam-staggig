import { Frame, Stomp } from "@stomp/stompjs";
import * as React from "react";
import { useRef } from "react";
import SockJS from "sockjs-client";
import {
  IConnectOptions,
  ISockJsContext,
  ISubscribeOptions,
  SockJsContext,
} from "./ISockJsContext";

interface Props {
  onError?: (error: Frame | string) => any;
}

export const SockJsProvider: React.FunctionComponent<any> = ({
  onError: globalErrorHandler,
  children,
}) => {
  const clientRef = useRef<any>(null);

  const connectHandler = (options: IConnectOptions) => {
    const { url, debug, headers, onError, heartbeat, onConnected } = options;

    if (!clientRef.current) {
      clientRef.current = Stomp.over(new SockJS(url));

      if (!debug) {
        clientRef.current.debug = () => {};
      }

      if (heartbeat) {
        clientRef.current.heartbeat.incoming = heartbeat.incoming;
        clientRef.current.heartbeat.outgoing = heartbeat.outgoing;
      }

      clientRef.current.connect(
        headers || {},
        (frame: any) => {},
        (error: Frame | string) => {
          const frame = error as Frame;

          if (frame && frame.command === "ERROR") {
            if (clientRef.current) {
              clientRef.current.disconnect(() => {
                clientRef.current = null;
              });

              connectHandler(options);
            }
          } else {
            if (onError) {
              onError(error);
            }
          }
        }
      );
    }

    if (onConnected) {
      const interval = setInterval(() => {
        if (clientRef.current?.connected) {
          onConnected(clientRef.current);
          clearInterval(interval);
        }
      }, 100);
    }
  };

  const disconnectHandler = () => {
    if (clientRef.current && clientRef.current.connected) {
      for (const subscription in clientRef.current.subscriptions) {
        clientRef.current.unsubscribe(subscription);
      }
      clientRef.current.disconnect(() => {
        clientRef.current = null;
      });
    }
  };

  const subscribeHandler = ({
    headers,
    destination,
    onMessage,
    onSubscribed,
  }: ISubscribeOptions) => {
    if (!clientRef.current) {
      return;
    }

    const subscription = clientRef.current.subscribe(
      destination,
      onMessage,
      headers
    );

    if (onSubscribed) {
      onSubscribed(subscription);
    }
  };

  const unsubscribeHandler = (subscription?: any) => {
    if (!clientRef.current || !clientRef.current.connected) {
      return;
    }

    if (subscription && subscription.id) {
      clientRef.current.unsubscribe(subscription.id);
    }

    if (
      !clientRef.current.subscriptions ||
      Object.keys(clientRef.current.subscriptions).length === 0
    ) {
      clientRef.current.disconnect(() => {
        clientRef.current = null;
      });
    }
  };

  const provider: ISockJsContext = {
    connect: connectHandler,
    disconnect: disconnectHandler,
    subscribe: subscribeHandler,
    unsubscribe: unsubscribeHandler,
  };

  return (
    <SockJsContext.Provider value={provider}>{children}</SockJsContext.Provider>
  );
};
