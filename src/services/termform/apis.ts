import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum TermFormIEnums {
    TERMS_FORM = '/terms-form',
    TERMS_OF_CONTRACT = '/terms-of-contract',
}
export const TermFormAPIs = ApiHelper.getListUri(NEXT_PUBLIC_API_CORE, TermFormIEnums);