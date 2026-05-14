import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum ChangelogAPIEnums {
  BASE_CHANGELOG = '/activities-log',
}

export const ChangelogAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  ChangelogAPIEnums
);
