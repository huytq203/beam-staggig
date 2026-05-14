import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints'
import { ApiHelper } from 'src/helpers/api.helper'

export enum FeePolicyAPIEnums {
  FEE_POLICY_BASE_URL = '/fee-policies',
}

export const FeePolicyAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  FeePolicyAPIEnums,
)
