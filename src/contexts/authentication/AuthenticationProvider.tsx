import { menuOptions } from '@constants/menu.constant';
import { AuthHelper } from '@helpers/auth.helper';
import { AuthServices } from '@services/auth';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AuthenticationContext } from './AuthenticationContext';

export interface AuthenticationRequestProps {
  username?: string;
  password?: string;
  callbackUrl?: string;
}

export interface AuthenticationSignOutRequestProps {
  callbackUrl?: string;
  noRedirect?: boolean;
  redirectPath?: any;
}

export type signInType = 'credential' | 'google';

// Các redirect logout / hết session đều là same-origin và chạy client-side,
// nên lấy origin thực tế lúc runtime để không bị dính domain build-time (NEXT_PUBLIC_BASE
// bị nhúng cứng lúc build -> đổi domain sẽ redirect sai). Fallback về env chỉ để phòng SSR.
const getAuthUrl = (): string =>
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE ?? '';

export const authInitialState: any = {
  isLoggedIn: false,
  isLoginPending: false,
  loginError: null,
};

export const byPassUrl: string[] = [
  '/auth/signin',
  '/auth/forgot',
  '/auth/reset',
  '/test',
  '/maintenance',
  '/landing-page-report',
];
const byPassAuthenticatedUrl: string[] = [
  '/accounts/edit-information',
  '/accounts/edit-password',
  '/fee-policies/assign',
  '/expenditure/finance/cashflow-list',
  '/test',
  '/maintenance',
  '/configurations/receive-money/citad',
  '/configurations/receive-money/transfer-fee',
];

export const AuthenticationProvider = ({ children }: any) => {
  const router = useRouter();

  const [state, setState] = useState(authInitialState);

  const [profile, setProfile] = useState<any>(null);

  const [listAllowedUrl, setListAllowedUrl] = useState(() => {
    let listAllowedUrl: any = [];

    // const test = [
    //   {
    //     url: '/configurations/receive-money/citad',
    //     allowedRoles: ['beam_admin'],
    //   },
    // ];

    const getAllUrl = (root: any, parentAllowedUrls: any) => {
      for (const node of root) {
        if (node?.items) {
          getAllUrl(node?.items, node.allowedRoles);
        }

        if (node.url) {
          listAllowedUrl.push({
            url: node.url,
            allowedRoles: node.allowedRoles
              ? node.allowedRoles
              : parentAllowedUrls,
          });
        }
      }
    };
    // listAllowedUrl.push(...test);

    getAllUrl(menuOptions, null);
    return listAllowedUrl;
  });

  useEffect(() => {
    const userDataFromCookie = Cookies.get('user');
    const userData = userDataFromCookie ? JSON.parse(userDataFromCookie) : null;
    const pathName = router.pathname;
    const asPath = router.asPath;
    const { redirectUrl, endDate, startDate } = router.query;
    let isAllow = false;
    if (!userData) {
      for (const url of byPassUrl) {
        if (pathName.startsWith(url) || asPath.startsWith(url)) {
          isAllow = true;
          break;
        }
      }
      if (!isAllow) {
        signOut({
          redirectPath: router.asPath,
        });
      }
    }

    let isAuthenticatedByPassAllowed = false;

    for (const url of byPassAuthenticatedUrl) {
      if (pathName.startsWith(url) || asPath.startsWith(url)) {
        isAuthenticatedByPassAllowed = true;
        break;
      }
    }

    let isValidUrl = false;
    const currentPath: any = router.asPath;
    listAllowedUrl.forEach((x: any) => {
      if (currentPath.startsWith(x.url)) {
        isValidUrl = AuthHelper.allowRoleCheck(x.allowedRoles, userData?.roles);
      }
    });
    if (!isValidUrl && !isAllow && !isAuthenticatedByPassAllowed) {
      // router.push("/dashboard");
    }

    setProfile(userData);
  }, [router]);

  const startLoadingState = () => {
    setState({
      ...state,
      isLoginPending: true,
      isLoggedIn: false,
      loginError: null,
    });
  };

  const stopLoadingState = () => {
    setState({
      ...state,
      isLoginPending: false,
      isLoggedIn: false,
      loginError: null,
    });
  };

  const signIn = async (
    providerType: signInType,
    authRequest: AuthenticationRequestProps
  ) => {
    startLoadingState();
    const loginResponse = await AuthServices.login(authRequest).then(
      (x: any) => {
        stopLoadingState();
        return x;
      }
    );
    const response = loginResponse?.data?.data;
    if (loginResponse?.data?.data == null) {
      setState({
        ...state,
        loginError: loginResponse?.data,
      });
    } else {
      const { access_token: accessToken, refresh_token: refreshToken } =
        response;

      const responseUser: any = jwt_decode(accessToken);
      const user = {
        username: responseUser.preferred_username,
        email: responseUser.email,
        name: responseUser.name,
        given_name: responseUser.given_name,
        family_name: responseUser.family_name,
        roles: responseUser.realm_access.roles,
      };

      // Cookie do client set qua js-cookie nên KHÔNG thể đặt HttpOnly (chỉ server
      // đặt được qua Set-Cookie). Vì axios đọc token bằng JS để gắn header
      // Authorization, HttpOnly thật sự cần chuyển sang mô hình BFF (server proxy).
      // Trong kiến trúc hiện tại, hardening tối đa: Secure (chỉ gửi qua HTTPS) +
      // SameSite=Lax (chặn CSRF cho các request unsafe cross-site).
      const isSecure =
        typeof window !== 'undefined' && window.location.protocol === 'https:';
      const secureCookieOptions: Cookies.CookieAttributes = {
        secure: isSecure,
        sameSite: 'lax',
      };

      Cookies.set('user', JSON.stringify(user), secureCookieOptions);

      Cookies.set('REFRESH_TOKEN', refreshToken, secureCookieOptions);

      Cookies.set('ACCESS_TOKEN', accessToken, secureCookieOptions);
      localStorage.setItem('isLogout', 'false');

      setState({
        ...state,
        isLoggedIn: true,
      });
      if (authRequest?.callbackUrl) {
        window.location.href = authRequest.callbackUrl;
        // router.push(authRequest.callbackUrl)
      }
    }
  };

  const authCheckByRole = async (
    allowedRoles: any[] = [],
    accessData: any = true,
    callback: any
  ) => {
    if (typeof window !== 'undefined') {
      const userDataFromCookie = Cookies.get('user');
      const userData = userDataFromCookie
        ? JSON.parse(userDataFromCookie)
        : null;
      const roles = userData?.roles ?? [];
      const isLogout = JSON.parse(localStorage.getItem('isLogout') || '');
      const isValid = allowedRoles.some((element: any) => {
        return roles.includes(element);
      });

      if (
        (!isValid && isLogout == false) ||
        (!accessData && isLogout == false)
      ) {
        window.location.href = getAuthUrl() + '/dashboard';
      }
    }
  };
  const signOut = async (config: AuthenticationSignOutRequestProps = {}) => {
    // const { companyId, endDate, startDate } = router.query;
    const redirectPath = config.redirectPath;
    // endDate && startDate
    //   ? `companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`
    //   : config.redirectPath;
    stopLoadingState();
    localStorage.setItem('isLogout', 'true');
    const path = config.noRedirect ? '/' : decodeURIComponent(redirectPath);
    Cookies.remove('ACCESS_TOKEN');
    Cookies.remove('user');
    Cookies.remove('REFRESH_TOKEN');
    window.location.href = decodeURIComponent(
      `${getAuthUrl()}/auth/signin?redirectUrl=${path}`
    );
  };

  return (
    <AuthenticationContext.Provider
      value={{
        signIn: signIn,
        signOut: signOut,
        state: state,
        profile: profile,
        authCheckByRole: authCheckByRole,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
