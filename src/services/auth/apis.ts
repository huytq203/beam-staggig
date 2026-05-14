import { NEXT_PUBLIC_BEAM_API } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum AuthAPIEnums {
  LOGIN_ACCESS_TOKEN = '/account/login',
  LOGOUT_ACCESS_TOKEN = '/account/logout',
  RESET_PASSWORD = '/account-manager/password/forgot',
  VERIFY_RESET_TOKEN = '/tokens',
  RESET_CHANGE_PASSWORD = '/users/:userId/change-password',
  LOGIN_RECILIATION = '/account/reconciliation-login',
}

export const AuthAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_BEAM_API,
  AuthAPIEnums
);
