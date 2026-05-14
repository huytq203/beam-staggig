import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum LuckyBoxAPIEnums {
  USER_JOIN_EVENTS = '/user-join-events',
  USER_CHECKED_IN = '/user-checked-in',
  USER_TRANSACTIONS = '/user-transactions',
  PROCEDURE = '/completed-step',
  PRIZE = '/prize',
  REWARD = '/lucky-box/rewards',
  FRIEND_INVITATION = '/friend-invitation',
  REWARD_IMPORT = '/lucky-box/rewards/imports',
  ALL_PRIZE = '/get-all-prizes',
  LUCKY_BOX_STATS_EXPORT = '/lucky-box/stats/export',
}

export const LuckyBoxAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  LuckyBoxAPIEnums
);
