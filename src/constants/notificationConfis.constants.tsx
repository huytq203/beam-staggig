import { NotificationEnum } from './notification.constants';
import Router from 'next/router';
export const notificationConfigs = [
  {
    type: NotificationEnum.INFORMATION_PENDING,
    onAction: (data: any) => {
      Router.push(
        `/companies/${data.companyId}/ticket/${data.ticketId}/ticket-update-information`
      );
    },
  },
  {
    type: NotificationEnum.SALARY_ADVANCE_PENDING,
    onAction: (data: any) => {
      Router.push(
        `/companies/${data.companyId}/ticket/${data.ticketId}/ticket-register-salary`
      );
    },
  },
  {
    type: NotificationEnum.TICKET_NEW_COMPANY,
    onAction: (data: any) => {
      Router.push(
        `/ticket-management/${data.ticketId}/ticket-register-company`
      );
    },
  },
  {
    type: NotificationEnum.NEW_SALARY_ADVANCE_PENDING_TICKET,
    onAction: (data: any) => {
      Router.push(
        `/companies/${data.companyId}/ticket-salary-advance/${data.ticketId}/ticket-salary-advance-detail`
      );
    },
  },
  {
    type: NotificationEnum.FRIEND_INVITATION_ALERT_BUDGET_UNDER_500K_ADMIN,
    onAction: (data: any) => {
      Router.push(`/invite-friends/budget`);
    },
  },
  {
    type: NotificationEnum.PROFILE,
    onAction: (data: any) => {
      Router.push(`/companies/${data.companyId}/profiles/${data.profileId}`);
    },
  },
  {
    type: NotificationEnum.ACCOUNTING_ALERT_BEAM_UPLOAD,
    onAction: (data: any) => {
      Router.push(
        `/expenditure/debt/expenditure?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.RECONCILIATION_ALERT_FINAL_UPDATE,
    onAction: (data: any) => {
      Router.push(
        `/reconciliation/concern?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.RECONCILIATION_ALERT_HRADMIN_UPLOAD_FINAL,
    onAction: (data: any) => {
      Router.push(
        `/reconciliation/concern?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.RECONCILIATION_ALERT_HRADMIN_UPLOAD_FINAL_PDF,
    onAction: (data: any) => {
      Router.push(
        `/reconciliation/concern?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.RECONCILIATION_ALERT_HRADMIN_UPLOAD,
    onAction: (data: any) => {
      Router.push(
        `/reconciliation/concern?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.RECONCILIATION_ALERT_BEAM_UPLOAD,
    onAction: (data: any) => {
      Router.push(
        `/reconciliation/concern?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.RECONCILIATION_ALERT_BEAM_UPLOAD_FINAL,
    onAction: (data: any) => {
      Router.push(
        `/reconciliation/concern?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.RECONCILIATION_ALERT_HRADMIN_UPLOAD_FINAL_BY_EMAIL,
    onAction: (data: any) => {
      Router.push(
        `/reconciliation/concern?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.RECONCILIATION_ALERT_BEAM_UPLOAD_FINAL,
    onAction: (data: any) => {
      Router.push(
        `/reconciliation/concern?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.RECONCILIATION_ALERT_BEAM_UPLOAD_ORIGIN,
    onAction: (data: any) => {
      Router.push(
        `/reconciliation/concern?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.RECONCILIATION_ALERT_BEAM_UPLOAD_FINAL_PDF,
    onAction: (data: any) => {
      Router.push(
        `/reconciliation/concern?companyId=${data.companyId}&startDate=${data.startTime}&endDate=${data.endTime}`
      );
    },
  },
  {
    type: NotificationEnum.VALIDATE_EMPLOYEE_INFORMATION_BEAM_ADMIN_DUPLICATE_PHONE_NUMBER,
    onAction: (data: any) => {
      Router.push(
        `/companies/${data.companyId}/employees/${data.employeeId}/edit`
      );
    },
  },
  {
    type: NotificationEnum.VALIDATE_EMPLOYEE_INFORMATION_BEAM_ADMIN_DUPLICATE_IDENTITY_NUMBER_AND_PHONE_NUMBER,
    onAction: (data: any) => {
      Router.push(
        `/companies/${data.companyId}/employees/${data.employeeId}/edit`
      );
    },
  },
  {
    type: NotificationEnum.VALIDATE_EMPLOYEE_INFORMATION_HR_ADMIN_DUPLICATE_PHONE_NUMBER,
    onAction: (data: any) => {
      Router.push(
        `/companies/${data.companyId}/employees/${data.employeeId}/edit`
      );
    },
  },
  {
    type: NotificationEnum.VALIDATE_EMPLOYEE_INFORMATION_HR_ADMIN_DUPLICATE_IDENTITY_NUMBER_AND_PHONE_NUMBER,
    onAction: (data: any) => {
      Router.push(
        `/companies/${data.companyId}/employees/${data.employeeId}/edit`
      );
    },
  },
  {
    type: NotificationEnum.VALIDATE_EMPLOYEE_INFORMATION_BEAM_ADMIN_DUPLICATE_IDENTITY_NUMBER,
    onAction: (data: any) => {
      Router.push(
        `/companies/${data.companyId}/employees/${data.employeeId}/edit`
      );
    },
  },
  {
    type: NotificationEnum.ALERT_EMPLOYEE_OF_INTEGRATION_COMPANY_INSUFFICIENT_PAY_LIMIT,
    onAction: (data: any) => {
      Router.push(
        `/companies/${data?.companyId}/employees?searchKey=${data?.phoneNumber}`
      );
    },
  },
  {
    type: NotificationEnum.ALERT_EMPLOYEE_OF_DEFAULT_COMPANY_INSUFFICIENT_PAY_LIMIT,
    onAction: (data: any) => {
      Router.push(
        `/companies/${data?.companyId}/employees?searchKey=${data?.phoneNumber}`
      );
    },
  },
  {
    type: NotificationEnum.ALERT_EXPIRING_FEE_POLICY,
    onAction: (data: any) => {
      Router.push(`/fee-policies/assign/${data?.feePolicyId}`);
    },
  },
];
