import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints'
import { ApiHelper } from 'src/helpers/api.helper'

export enum CompanyAPIEnums {
  GET_LIST_COMPANY = '/profiles',
}

export const CompanyAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  CompanyAPIEnums,
)
