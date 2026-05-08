import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum FriendInvitationAPIEnums {
  PRIEND_INVITATION_BASE_URL = '/friend-invitation',
  PRIEND_INVITATION_BUDGET_URL = '/friend-invitation-budget',
}

export const FriendInvitationAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  FriendInvitationAPIEnums
);
