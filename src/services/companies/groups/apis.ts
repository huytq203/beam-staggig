import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum GroupsAPIEnums {
  BASE_GROUP = '/employee-groups',
}

export const GroupsAPIs = ApiHelper.getListUri(NEXT_PUBLIC_API_CORE, GroupsAPIEnums);
