import { useContext } from 'react';
import { WidgetContext } from './WidgetContext';

export const useWidget = () => useContext(WidgetContext);
