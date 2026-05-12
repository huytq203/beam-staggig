import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints'
import { ApiHelper } from 'src/helpers/api.helper'

export enum FileManagerAPIEnums {
  BASE = '/',
}

export const FileManagerAPIs = ApiHelper.getListUri(
  '/api',
  FileManagerAPIEnums,
)
