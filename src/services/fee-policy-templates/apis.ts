import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints'
import { ApiHelper } from 'src/helpers/api.helper'

export enum FeePolicyTemplateAPIEnums {
  GET_LIST_FEE_POLICY = '/fee-policy-templates',
}

export const FeePolicyTemplateAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  FeePolicyTemplateAPIEnums,
)
