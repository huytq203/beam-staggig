import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum TicketAPIEnums {
  BASE_TICKET = '/tickets',
  TICKET_NEW_COMPANY = '/tickets/new-company-register',
}

export const TicketAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  TicketAPIEnums
);
