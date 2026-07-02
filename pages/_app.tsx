import { NotificationProvider } from '@components/widgets/Layouts/Layout/PrimaryLayout/NotificationProvider';
import { AppProvider } from '@contexts/AppContext';
import { AuthenticationProvider } from '@contexts/authentication';
import { LocaleProvider } from '@douyinfe/semi-ui';
import { SockJsProvider } from '@hooks/use-sockjs';
import { Frame } from '@stomp/stompjs';
import NextNProgress from 'nextjs-progressbar';
import { QueryClient, QueryClientProvider } from 'react-query';
import vi_VN from '../src/locale/source/vi_VN';
import 'swiper/css/bundle';
import '../styles/globals.scss';
import '../styles/transition.css';
import { WidgetProvider } from '@contexts/widgets';
// import Maintenance from './maintenance';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  // let isMaintenance;
  // if (typeof window !== 'undefined') {
  //   isMaintenance = localStorage.getItem('isMaintenance') ?? false;
  // }
  // if (isMaintenance) {
  //   return (
  //     <div>
  //       <Maintenance />
  //     </div>
  //   );
  // }
  return (
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <SockJsProvider onError={(error: Frame | string) => {}}>
            <WidgetProvider>
              <NotificationProvider>
                <LocaleProvider locale={vi_VN}>
                  <NextNProgress />
                  <Component {...pageProps} />
                </LocaleProvider>
              </NotificationProvider>
            </WidgetProvider>
          </SockJsProvider>
        </AppProvider>
      </QueryClientProvider>
    </AuthenticationProvider>
  );
}

export default MyApp;
