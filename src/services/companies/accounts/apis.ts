import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { ApiHelper } from 'src/helpers/api.helper';

export enum EmployeesAPIEnums {
  ADD_UPDATE_EMPLOYEES = '/employees',
  GET_LIST_EMPLOYEES = '/employees',
  DETAILS_EMPLOYEES = '/employees',
  WORK_DAY = '/work-day-manage',
  CHEK_ERROR_EMPLOYEE = '/check-update-employee',
}

export const EmployeeAPIs = ApiHelper.getListUri(
  NEXT_PUBLIC_API_CORE,
  EmployeesAPIEnums
);
