import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints'
import { ApiHelper } from 'src/helpers/api.helper'

export enum FileManagerAPIEnums {
  BASE = '/file-manager',
}

export const FileManagerAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  FileManagerAPIEnums,
)
