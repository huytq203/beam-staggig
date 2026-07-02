import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum CampaignAPIEnums {
  BASE_CAMPAIGN = '/campaigns',
  BASE_CAMPAIGN_TYPES = '/campaign-types',
  CAMPAIGN_TYPES_ENABLED = '/campaign-types-enabled',
}

export const CampaignAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  CampaignAPIEnums
);
