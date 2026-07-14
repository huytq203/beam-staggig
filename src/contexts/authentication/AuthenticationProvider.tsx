import { menuOptions } from '@constants/menu.constant';
import { AuthHelper } from '@helpers/auth.helper';
import { AuthServices } from '@services/auth';
import { saveAuthTokens } from '@services/auth/token.refresh';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AuthenticationContext } from './AuthenticationContext';

export interface AuthenticationRequestProps {
  username?: string;
  password?: string;
  callbackUrl?: string;
  recaptchaToken?: string;
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
    setState((prev: any) => ({
      ...prev,
      isLoginPending: true,
      isLoggedIn: false,
      loginError: null,
    }));
  };

  const stopLoadingState = () => {
    setState((prev: any) => ({
      ...prev,
      isLoginPending: false,
    }));
  };

  // Tạo session từ response chứa token (dùng chung cho login thường + verify-otp).
  const establishSession = (response: any, callbackUrl?: string) => {
    const { access_token: accessToken, refresh_token: refreshToken } = response;

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
    // expires: token sống qua lần đóng/mở browser để refresh session (Hướng B).
    const isSecure =
      typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureCookieOptions: Cookies.CookieAttributes = {
      secure: isSecure,
      sameSite: 'lax',
      expires: 7,
    };

    Cookies.set('user', JSON.stringify(user), secureCookieOptions);

    saveAuthTokens(accessToken, refreshToken);
    localStorage.setItem('isLogout', 'false');

    setState((prev: any) => ({
      ...prev,
      isLoggedIn: true,
    }));
    if (callbackUrl) {
      window.location.href = callbackUrl;
    }
  };

  // Bước 1: gửi username/password (+recaptcha) tới /account/login. BE xác thực
  // mật khẩu rồi GỬI OTP SMS và trả { requireOtp, phoneHint } (KHÔNG kèm token).
  // Trả về data cho LoginForm quyết định hiển thị màn nhập OTP.
  // (Nếu BE không bật OTP mà trả token trực tiếp thì đăng nhập luôn.)
  const requestLoginOtp = async (
    authRequest: AuthenticationRequestProps
  ): Promise<any> => {
    startLoadingState();
    try {
      const loginResponse = await AuthServices.login(authRequest);
      const data = loginResponse?.data?.data;
      if (data == null) {
        setState((prev: any) => ({
          ...prev,
          loginError: loginResponse?.data,
        }));
        return null;
      }
      if (data.access_token) {
        establishSession(data, authRequest?.callbackUrl);
        return { loggedIn: true };
      }
      return data; // { requireOtp, phoneHint }
    } catch (error: any) {
      setState((prev: any) => ({
        ...prev,
        loginError: error?.response?.data ?? error,
      }));
      return null;
    } finally {
      stopLoadingState();
    }
  };

  // Bước 2: xác thực OTP -> /account/login/verify-otp -> nhận token -> tạo session.
  // Ném lỗi khi OTP sai/hết hạn để màn VerifyOTP hiển thị và cho nhập lại.
  const verifyLoginOtp = async (
    authRequest: AuthenticationRequestProps,
    otp: string
  ): Promise<void> => {
    const res = await AuthServices.verifyLoginOtp({
      username: authRequest.username,
      password: authRequest.password,
      otp,
    });
    const data = res?.data?.data;
    if (!data?.access_token) {
      throw new Error('Mã OTP không đúng hoặc đã hết hạn, vui lòng thử lại!');
    }
    establishSession(data, authRequest.callbackUrl);
  };

  const signIn = async (
    providerType: signInType,
    authRequest: AuthenticationRequestProps
  ) => {
    startLoadingState();
    try {
      const loginResponse = await AuthServices.login(authRequest);
      const response = loginResponse?.data?.data;
      if (response == null) {
        setState((prev: any) => ({
          ...prev,
          loginError: loginResponse?.data,
        }));
        return;
      }
      if (!response.access_token) {
        // BE yêu cầu OTP -> luồng này không tự đăng nhập được;
        // dùng requestLoginOtp + verifyLoginOtp (xem LoginForm).
        return;
      }
      establishSession(response, authRequest?.callbackUrl);
    } catch (error: any) {
      setState((prev: any) => ({
        ...prev,
        loginError: error?.response?.data ?? error,
      }));
    } finally {
      stopLoadingState();
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
        requestLoginOtp: requestLoginOtp,
        verifyLoginOtp: verifyLoginOtp,
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
