import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum ConfigurationAPIEnums {
  BASIC_CONFIGURATION = '/basic-config',
  ADVANCE_CONFIGURATION = '/advanced-config',
  ADVANCE_RECEIVER_CONFIGURATION = '/advanced-config/receiver',
  TRANSFER_FEE = '/transfer-type/transfer-fee',
  TRANSFER_TYPE = '/transfer-type',
  EMPLOYEE_CONFIG = '/employees/all',
}

export const ConfigurationAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  ConfigurationAPIEnums
);
