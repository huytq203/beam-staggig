import { NEXT_PUBLIC_BEAM_API } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum UserAPIEnums {
  GET_LIST_ALL_USER = '/users',
  ADD_USER = '/users',
  BASE_PATH = '/users',
  RESET_PASSWORD_USER = '/users/reset-password',
  BASE_URL = '/account-manager',
  BEAM_ADMIN = '/account-manager/admin',
  HR_ADMIN = '/account-manager/hr-admin',
  USER = '/account-manager/user',
  BASE_CHANGE_LOG_USER = '/activities-log',
}

export const UserAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_BEAM_API,
  UserAPIEnums
);
