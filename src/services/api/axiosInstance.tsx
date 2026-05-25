import { byPassUrl } from '@contexts/authentication';
import { Modal, Notification } from '@douyinfe/semi-ui';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getResponseMessage } from './handlers';
import { NEXT_PUBLIC_API_MAINTENANCE } from '@constants/endpoints';
import { useState } from 'react';
export const getAccessToken = () => {
  const access_token = Cookies.get('ACCESS_TOKEN');
  return access_token;
};

export const getRequestHeaders = () => {
  const access_token = getAccessToken();
  return {
    headers: { Authorization: `Bearer ${access_token}` },
  };
};

const baseURL = process.env.NEXT_PUBLIC_ADMIN_MANAGER_API;
export const axiosInstance = axios.create({
  baseURL,
  headers: getAccessToken()
    ? {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': 'http://localhost:3000',
      }
    : undefined,
});

export const refeshToken = () => {
  axiosInstance.interceptors.request.use(function (config: any) {
    config.headers.Authorization = `Bearer ${getAccessToken()}`;
    return config;
  });
};

//Check system is maintenance
const checkIsMaintenance = async () => {
  const isMaintenance = await axios.get(NEXT_PUBLIC_API_MAINTENANCE, {
    headers: {
      'x-api-key': 'FTmU6ROoDE8coK3nZWy5Ga1oBSesUB5H4Wm6ixuU',
    },
  });
  return isMaintenance;
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const controller = new AbortController();
    const { pathname } = window.location;

    const token = getAccessToken();
    const userJSON = Cookies.get('user');

    let isByPassed = false;

    for (const url of byPassUrl) {
      if (pathname.startsWith(url)) {
        isByPassed = true;
        break;
      }
    }

    if ((!token || !userJSON) && !isByPassed) {
      controller.abort();
    }

    // Do something before request is sent
    const urlSearch = new URLSearchParams(config.url);
    if (urlSearch.get('progress') === 'false') {
    } else {
      // NProgress.start();
    }
    return {
      ...config,
      signal: controller.signal,
    };
  },
  function (error) {
    // Do something with request error
    handleError(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const responseData = response?.data;
    const isSuccess = responseData.success || responseData.Success;
    localStorage.setItem('isMaintenanceNoti', 'false');
    const statusCode = responseData.code ?? response?.status;
    const exceptError = [
      'EXISTED_EMPLOYEE_PHONE_NUMBER',
      'EXISTED_IDENTITY_NUMBER',
      'EXISTED_EMPLOYEE_PHONE_NUMBER_AND_IDENTITY_NUMBER_IN_OTHER_COMPANY',
      'EXISTED_EMPLOYEE_PHONE_NUMBER_AND_IDENTITY_NUMBER',
    ];
    // if (statusCode == 401) {
    //   Cookies.remove('ACCESS_TOKEN')
    //   Cookies.remove('REFRESH_TOKEN')
    //   window.location.href = '/auth/signin'
    // }

    if (statusCode == 403 || statusCode == 401) {
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('REFRESH_TOKEN');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }

    if (
      statusCode !== 200 &&
      statusCode !== 204 &&
      statusCode !== 403 &&
      statusCode !== 401 &&
      statusCode !== 406
    ) {
      let opts: any = {
        title: 'Có lỗi xảy ra!',
        content: (
          <>
            {responseData?.message == 'TICKET_NOT_PROCESSED' ? (
              <div>
                Thông tin tài khoản của nhân sự đang yêu cầu được thay đổi.{' '}
                <a
                  target="_blank"
                  href={`/companies/${responseData?.data?.companyId}/ticket/${
                    responseData?.data?.ticketId
                  }/${
                    responseData?.data?.type === 'INFORMATION'
                      ? 'ticket-update-information'
                      : 'ticket-register-salary'
                  }`}
                >
                  Xem tại đây
                </a>{' '}
              </div>
            ) : (
              <>
                <div>{getResponseMessage(responseData?.message)}</div>
              </>
            )}
          </>
        ),
        duration: 10,
        theme: 'light',
      };
      !exceptError.includes(responseData?.message) && Notification.error(opts);
    }
    if (statusCode === 406) {
      let opts: any = {
        title: 'Cảnh báo!',
        content: (
          <>
            <div>{getResponseMessage(responseData?.message)}</div>
          </>
        ),
        duration: 10,
        theme: 'light',
      };
      Notification.warning(opts);
    }
    if (
      (response && isSuccess === false) ||
      (response.status !== 200 &&
        response.status !== 204 &&
        response.status !== 304) ||
      (response && responseData && isSuccess)
    ) {
      //skip system error handle.
      (response.headers.errorHandle === 'undefined' ||
        response.headers.errorHandle) &&
        handleError(responseData);
    }

    return response;
  },
  (error) => {
    // NProgress.done();
    let response = error.response;
    const responseData = response?.data;
    const statusCode = responseData?.code ? responseData?.code : response?.code;

    if (statusCode == 401) {
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('REFRESH_TOKEN');
      Cookies.remove('user');

      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }

    if (statusCode == 403) {
      // if (typeof window !== 'undefined') {
      window.location.href = '/';
      // }
    }
    if (response) {
      if (
        responseData?.message == 'EXISTED_EMPLOYEE_BANK_ACCOUNT_NUMBER' &&
        responseData?.code === 400
      ) {
        return;
      } else if (
        statusCode !== 200 &&
        statusCode !== 204 &&
        statusCode !== 403 &&
        statusCode !== 401 &&
        statusCode !== 406
      ) {
        let opts: any = {
          title: 'Có lỗi xảy ra!',
          content: (
            <>
              <div>{getResponseMessage(responseData?.message)}</div>
            </>
          ),
          duration: 3,
          theme: 'light',
        };
        Notification.error(opts);
      } else if (statusCode === 406) {
        let opts: any = {
          title: 'Cảnh báo!',
          content: (
            <>
              <div>{getResponseMessage(responseData?.message)}</div>
            </>
          ),
          duration: 10,
          theme: 'light',
        };
        Notification.warning(opts);
      }
    } else {
      handleError(error);
    }
    if (error?.message === 'Network Error') {
      const errorUrl = error?.config?.url;
      const { pathname } = window.location;
      if (pathname !== '/maintenance') {
        checkIsMaintenance().then((res: any) => {
          const serviceMaintenance = new Map();
          serviceMaintenance.set('https://identity', 'webInMaintenanceIdentiy');
          serviceMaintenance.set('https://payment', 'webInMaintenancePayment');
          serviceMaintenance.set('https://report', 'webInMaintenanceReport');
          serviceMaintenance.set('https://core', 'webInMaintenanceCore');
          localStorage.setItem('maintenanceTitle', res?.data?.maintenanceTitle);
          localStorage.setItem(
            'maintenanceMessage',
            res?.data?.maintenanceMessage
          );
          if (res?.data?.webInMaintenance == true) {
            window.location.href = '/maintenance';
            // controller.abort();
          } else if (
            res?.data?.webInMaintenanceNoti &&
            errorUrl?.includes('https://notification')
          ) {
            localStorage.setItem('isMaintenanceNoti', 'true');
            // controller.abort();
          } else if (
            !res?.data?.webInMaintenanceNoti &&
            errorUrl?.includes('https://notification')
          ) {
            localStorage.setItem('isMaintenanceNoti', 'false');
          } else {
            for (const [key, value] of serviceMaintenance.entries()) {
              if (errorUrl?.includes(key) && res?.data[value]) {
                window.location.href = '/maintenance';
                // controller.abort();
                break; // Exit loop if you find a match
              }
            }
          }
          return res;
        });
      }
    }
  }
);

let lastMessage = '';
export function handleError(error: any) {
  let defaultMessage = 'An error occurred while getting data';
  let message = defaultMessage;
  if (error.response) message = error.response?.data?.Message;
  else if (error.request) message = error.message;
  else message = error.message;

  if (message === lastMessage && lastMessage !== '') return;
  // Notify.error(message || defaultMessage);
  lastMessage = '';
}

//define default interface for struture input data for get/post
interface axiosDataProps {
  url: string;
  data?: any;
  errorHandle?: boolean;
}
/**
 * axiosPost - Using for post data by using axios
 * @param props axiosDataProps
 * @returns async function with data
 */
export const axiosPost = (props: axiosDataProps) => {
  const { url, data, errorHandle = true } = props;
  return axiosInstance.post(url, data, {
    headers: { errorHandle: errorHandle },
  });
};

/**
 * axiosGet - Using for get data by using axios
 * @param props axiosDataProps
 * @returns async function with data
 */
export const axiosGet = (props: axiosDataProps) => {
  const { url, data, errorHandle = true } = props;

  return axiosInstance.get(url, {
    params: data,
    headers: { errorHandle: errorHandle },
  });
};
