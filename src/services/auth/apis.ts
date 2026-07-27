import { NEXT_PUBLIC_BEAM_API } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum AuthAPIEnums {
  LOGIN_ACCESS_TOKEN = '/account/login',
  LOGOUT_ACCESS_TOKEN = '/account/logout',
  RESET_PASSWORD = '/account-manager/password/forgot',
  VERIFY_RESET_TOKEN = '/tokens',
  RESET_CHANGE_PASSWORD = '/users/change-password',
  LOGIN_RECILIATION = '/account/reconciliation-login',
  REFRESH_TOKEN = '/account/refresh-token',
  LOGIN_VERIFY_OTP = '/account/login/verify-otp',
  LOGIN_RECILIATION_VERIFY_OTP = '/account/reconciliation-login/verify-otp',
}

export const AuthAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_BEAM_API,
  AuthAPIEnums
);
