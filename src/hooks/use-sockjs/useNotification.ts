import { useContext } from "react";
import { NotificationContext } from "./INotificationContext";

export const useNotification = () => {
  return useContext(NotificationContext);
};
