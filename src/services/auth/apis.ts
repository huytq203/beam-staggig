import { NEXT_PUBLIC_BEAM_API } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

// Login / refresh / logout đã chuyển sang Unified Identity (flexpay-identity +
// Keycloak 26, realm `ewa-hr`). Body & response dùng camelCase:
//   login   { username, password }  -> data { accessToken, refreshToken, expiresIn, ... }
//   refresh { refreshToken }        -> giống login
//   logout  { refreshToken }        -> data { loggedOut: true }
// Các endpoint còn lại vẫn là của beam.ewa.identity cũ, BE CHƯA chuyển sang
// flexpay-identity (OTP, chốt đối soát, quên/đổi mật khẩu) -> sẽ lỗi trên DEV mới.
export enum AuthAPIEnums {
  LOGIN_ACCESS_TOKEN = '/api/v1/ewa-hr/auth/login',
  LOGOUT_ACCESS_TOKEN = '/api/v1/ewa-hr/auth/logout',
  RESET_PASSWORD = '/account-manager/password/forgot',
  VERIFY_RESET_TOKEN = '/tokens',
  RESET_CHANGE_PASSWORD = '/users/change-password',
  LOGIN_RECILIATION = '/account/reconciliation-login',
  REFRESH_TOKEN = '/api/v1/ewa-hr/auth/refresh',
  LOGIN_VERIFY_OTP = '/account/login/verify-otp',
  LOGIN_RECILIATION_VERIFY_OTP = '/account/reconciliation-login/verify-otp',
}

export const AuthAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_BEAM_API,
  AuthAPIEnums
);
