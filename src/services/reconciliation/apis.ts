import { NEXT_PUBLIC_API_CORE2 } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum ReconciliationAPIEnums {
  BASE_RECONCILIATION = '/reconciliations',
  RECONCILIATION = '/reconciliation',
  GET_LIST_RECONCILIATION = '/reconciliations/list-files',
  BASE_TRANSACTION = '/transactions',
  GET_LIST_TRANSACTION_MISMATCH_TRANSACTION = '/transactions/mismatch-transactions',
  GET_LIST_TRANSACTION_UPDATE_TRANSACTION = '/transactions/update-transaction-tickets',
  GET_DETAIL_MISMATCH_TICKET = '/transactions/mismatch-tickets',
  UPLOAD_FILE_RECONCILIATION_CONCERN = '/reconciliation/upload-companies-reconciliation',
  GET_RECONCILIATION_LANDING = '/reconciliation/landing-page-report',
}

export const ReconciliationAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE2,
  ReconciliationAPIEnums
);
