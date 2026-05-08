import { createContext } from 'react';

export const WidgetContext = createContext({
  checkLoadingComponent: (loading?: any) => {},
});
