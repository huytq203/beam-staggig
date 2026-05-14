import { COMMON_FORMAT } from '@constants/common-format';
import { ArrayHelper } from './array.helper';
import { DateTimeHelper } from './date-time.helper';

export const ConvertLogHelper = {
  convertLogProfile(oldState: any, newState: any) {
    if (newState) {
      Object.keys(newState).forEach((key: any) => {
        if (key == 'startTime') {
          newState[key] = ArrayHelper.convertDateFromArray(newState[key]);
        }
        if (key == 'endTime') {
          newState[key] = ArrayHelper.convertDateFromArray(newState[key]);
        }
      });
    }
    if (oldState) {
      Object.keys(oldState).forEach((key: any) => {
        if (key == 'startTime') {
          oldState[key] = ArrayHelper.convertDateFromArray(oldState[key]);
        }
        if (key == 'endTime') {
          oldState[key] = ArrayHelper.convertDateFromArray(oldState[key]);
        }
      });
    }
    return {
      oldState: {
        ...oldState,
        uploadEmployeeStartDay: oldState?.uploadEmployeeStartDay
          ? oldState?.uploadEmployeeStartDay
          : null,
        uploadEmployeeEndDay: oldState?.uploadEmployeeEndDay
          ? oldState?.uploadEmployeeEndDay
          : null,
      },
      newState: {
        ...newState,
        uploadEmployeeStartDay: newState?.uploadEmployeeStartDay
          ? newState?.uploadEmployeeStartDay
          : null,
        uploadEmployeeEndDay: newState?.uploadEmployeeEndDay
          ? newState?.uploadEmployeeEndDay
          : null,
      },
    };
  },

  convertLogCompany(oldState: any, newState: any) {
    let convertNewState = {
      ...newState,
      transManageSalaryAdvanceRequest: newState?.manageSalaryAdvanceRequest,
    };
    let convertOldState = {
      ...oldState,
      transManageSalaryAdvanceRequest: oldState?.manageSalaryAdvanceRequest,
    };
    if (newState) {
      Object.keys(newState).forEach((key: any) => {
        if (key == 'blockStart') {
          newState[key] = ArrayHelper.convertDateFromArray(
            newState[key],
            COMMON_FORMAT.DATE_TIME
          );
        }
        if (key == 'blockEnd') {
          newState[key] = ArrayHelper.convertDateFromArray(
            newState[key],
            COMMON_FORMAT.DATE_TIME
          );
        }
      });
    }
    if (oldState) {
      Object.keys(oldState).forEach((key: any) => {
        if (key == 'blockStart') {
          oldState[key] = ArrayHelper.convertDateFromArray(
            oldState[key],
            COMMON_FORMAT.DATE_TIME
          );
        }
        if (key == 'blockEnd') {
          oldState[key] = ArrayHelper.convertDateFromArray(
            oldState[key],
            COMMON_FORMAT.DATE_TIME
          );
        }
      });
    }

    delete convertNewState?.manageSalaryAdvanceRequest;
    delete convertOldState?.manageSalaryAdvanceRequest;
    return {
      oldState: {
        ...convertOldState,
      },
      newState: {
        ...convertNewState,
      },
    };
  },

  convertLogEmployee(oldState: any, newState: any, companyData: any) {
    if (newState) {
      Object.keys(newState).forEach((key: any) => {
        if (key == 'startApplyDate') {
          newState[key] = ArrayHelper.convertDateFromArray(newState[key]);
        }
        if (key == 'dob') {
          newState[key] = ArrayHelper.convertDateFromArray(newState[key]);
        }
        if (key == 'identificationProvideDay') {
          newState[key] = ArrayHelper.convertDateFromArray(newState[key]);
        }
        if (key == 'registerSalaryAdvanceTime') {
          newState[key] = ArrayHelper.convertDateFromArray(newState[key]);
        }
        if (key == 'groups' && newState.groups === null) {
          newState[key] = [];
        }
        if (key == 'bankBranch' && newState.bankBranch === '') {
          newState[key] = null;
        }
        if (key == 'bankCity' && newState.bankCity === '') {
          newState[key] = null;
        }
        if (
          key == 'identificationAddress' &&
          newState.identificationAddress === ''
        ) {
          newState[key] = null;
        }
        if (key == 'email' && newState.email === '') {
          newState[key] = null;
        }
      });
    }

    if (oldState) {
      Object.keys(oldState).forEach((key: any) => {
        if (key == 'startApplyDate') {
          oldState[key] = ArrayHelper.convertDateFromArray(oldState[key]);
        }
        if (key == 'dob') {
          oldState[key] = ArrayHelper.convertDateFromArray(oldState[key]);
        }
        if (key == 'identificationProvideDay') {
          oldState[key] = ArrayHelper.convertDateFromArray(oldState[key]);
        }
        if (key == 'groups' && oldState.groups === null) {
          oldState[key] = [];
        }
        if (key == 'registerSalaryAdvanceTime') {
          oldState[key] = ArrayHelper.convertDateFromArray(oldState[key]);
        }
        if (key == 'bankBranch' && oldState.bankBranch === '') {
          oldState[key] = null;
        }
        if (key == 'bankCity' && oldState.bankCity === '') {
          oldState[key] = null;
        }
        if (
          key == 'identificationAddress' &&
          oldState.identificationAddress === ''
        ) {
          oldState[key] = null;
        }
        if (key == 'email' && oldState.email === '') {
          oldState[key] = null;
        }
      });
    }

    if (!oldState?.advancedAmount && !newState?.advancedAmount) {
      delete oldState?.advancedAmount;
      delete newState?.advancedAmount;
    }
    if (companyData?.workDayType !== 'FIXED_WORKDAY') {
      delete oldState?.socialInsuranceNumber;
      delete newState?.socialInsuranceNumber;
    }
    return {
      oldState: oldState,
      newState: newState,
    };
  },
  convertLogFeePolicyTemplate(oldState: any, newState: any) {
    const convertOldState = {
      ...oldState,
      feeRangeValueType: oldState?.feeValue + ':' + oldState?.feeRangeType,
    };

    const convertNewState = {
      ...newState,
      feeRangeValueType: newState?.feeValue + ':' + newState?.feeRangeType,
    };
    return {
      oldState: convertOldState,
      newState: convertNewState,
    };
  },
  convertLogFeePolicy(oldState: any, newState: any) {
    let oldStateFP = oldState?.feePolicy;

    const getAppliedNameCompany = (data: any) => {
      return data?.appliedCompany
        ? data?.appliedCompany?.map((x: any) => {
            return x?.name;
          })
        : [];
    };

    const convertOldState = {
      ...oldStateFP,
      startTime: ArrayHelper.convertDateFromArray(
        oldStateFP?.startTime,
        COMMON_FORMAT.DATE_TIME
      ),
      endTime: ArrayHelper.convertDateFromArray(
        oldStateFP?.endTime,
        COMMON_FORMAT.DATE_TIME
      ),
      feeRangeValueType: oldStateFP?.feeValue + ':' + oldStateFP?.feeRangeType,
      appliedCompanyName: getAppliedNameCompany(oldState),
    };

    let newStateFP = newState?.feePolicy;

    const convertNewState = {
      ...newStateFP,
      startTime: ArrayHelper.convertDateFromArray(
        newStateFP?.startTime,
        COMMON_FORMAT.DATE_TIME
      ),
      endTime: ArrayHelper.convertDateFromArray(
        newStateFP?.endTime,
        COMMON_FORMAT.DATE_TIME
      ),
      feeRangeValueType: newStateFP?.feeValue + ':' + newStateFP?.feeRangeType,
      appliedCompanyName: getAppliedNameCompany(newState),
    };
    return {
      oldState: convertOldState,
      newState: convertNewState,
    };
  },

  convertLogCampaign(oldState: any, newState: any) {
    let oldStateFP = oldState?.campaign;

    const getAppliedObjects = (data: any) => {
      return data?.appliedObjects
        ? data?.appliedObjects?.map((x: any) => {
            return x?.name;
          })
        : [];
    };

    const getCompanyApplyName = (data: any) => {
      return data?.campaign?.applyType == 0 ? data?.companyEmployee?.name : '';
    };

    const getGroupApplyName = (data: any) => {
      return data?.groupIds?.length > 0
        ? data?.groupIds?.map((x: any) => {
            return x?.name;
          })
        : [];
    };

    const getValueCampaign = (data: any) => {
      return data?.campaign?.value + ':' + data?.campaign?.valueType;
    };

    const convertOldState = {
      ...oldStateFP,
      startTime: ArrayHelper.convertDateFromArray(
        oldStateFP?.startTime,
        COMMON_FORMAT.DATE_TIME
      ),
      endTime: ArrayHelper.convertDateFromArray(
        oldStateFP?.endTime,
        COMMON_FORMAT.DATE_TIME
      ),
      appliedObjects: getAppliedObjects(oldState),
      companyApplyName: getCompanyApplyName(oldState),
      groupApplyName: getGroupApplyName(oldState),
      valueCampaign: getValueCampaign(oldState),
    };
    delete convertOldState.value;
    delete convertOldState.valueType;
    let newStateFP = newState?.campaign;

    const convertNewState = {
      ...newStateFP,
      startTime: ArrayHelper.convertDateFromArray(
        newStateFP?.startTime,
        COMMON_FORMAT.DATE_TIME
      ),
      endTime: ArrayHelper.convertDateFromArray(
        newStateFP?.endTime,
        COMMON_FORMAT.DATE_TIME
      ),
      appliedObjects: getAppliedObjects(newState),
      companyApplyName: getCompanyApplyName(newState),
      groupApplyName: getGroupApplyName(newState),
      valueCampaign: getValueCampaign(newState),
    };

    delete convertNewState.value;
    delete convertNewState.valueType;

    return {
      oldState: convertOldState,
      newState: convertNewState,
    };
  },
  convertUserEntity(oldState: any, newState: any) {
    const getCompanyName = (data: any) => {
      return data?.companies?.companyNames?.length > 0
        ? data?.companies?.companyNames?.map((x: any) => {
            return x;
          })
        : [];
    };
    const getEligibleCompanyNames = (data: any) => {
      return data?.companies?.eligibleCompanyNames?.length > 0
        ? data?.companies?.eligibleCompanyNames?.map((x: any) => {
            return x;
          })
        : [];
    };
    const convertOldState = {
      ...oldState,
      companies: getCompanyName(oldState),
      eligibleCompanyNames: getEligibleCompanyNames(oldState),
    };

    const convertNewState = {
      ...newState,
      companies: getCompanyName(newState),
      eligibleCompanyNames: getEligibleCompanyNames(newState),
    };
    return {
      oldState: convertOldState,
      newState: convertNewState,
    };
  },

  convertLogPayMoney(oldState: any, newState: any) {
    const convertOldState = {
      ...oldState,
      startAppliedDate: ArrayHelper.convertDateFromArray(
        oldState?.startAppliedDate,
        COMMON_FORMAT.DATE_TIME
      ),
      endAppliedDate: ArrayHelper.convertDateFromArray(
        oldState?.endAppliedDate,
        COMMON_FORMAT.DATE
      ),
      bankCodePM: oldState?.bankCode,
      statusPM: oldState?.status,
    };

    delete convertOldState.bankCode;
    delete convertOldState.status;

    const convertNewState = {
      ...newState,
      startAppliedDate: ArrayHelper.convertDateFromArray(
        newState?.startAppliedDate,
        COMMON_FORMAT.DATE_TIME
      ),
      endAppliedDate: ArrayHelper.convertDateFromArray(
        newState?.endAppliedDate,
        COMMON_FORMAT.DATE
      ),
      bankCodePM: newState?.bankCode,
      statusPM: newState?.status,
    };

    delete convertNewState.bankCode;
    delete convertNewState.status;
    return {
      oldState: convertOldState,
      newState: convertNewState,
    };
  },

  convertLogSendingBankStatus(oldState: any, newState: any) {
    const convertOldState = {
      ...oldState,
      pvComBankStatus: oldState?.pvComBankStatus,
      vietComBankStatus: oldState?.vietComBankStatus,
      vpBankStatus: oldState?.vpBankStatus,
      bankCodeDefault: oldState?.bankCode,
      bankShortName: oldState?.bankShortName,
      bankName: oldState?.bankName,
    };
    delete convertOldState.bankCode;
    delete convertOldState.bankShortName;
    delete convertOldState.bankName;

    const convertNewState = {
      ...newState,
      pvComBankStatus: newState?.pvComBankStatus,
      vietComBankStatus: newState?.vietComBankStatus,
      vpBankStatus: newState?.vpBankStatus,
      bankCodeDefault: newState?.bankCode,
      bankShortName: newState?.bankShortName,
      bankName: newState?.bankName,
    };
    delete convertNewState.bankCode;
    delete convertNewState.bankShortName;
    delete convertNewState.bankName;

    return {
      oldState: convertOldState,
      newState: convertNewState,
    };
  },
  convertLogAccounting(oldState: any, newState: any, companyNameData: any) {
    const salaryPeriodStartOld = ArrayHelper.convertDateFromArray(
      oldState?.salaryPeriodStart,
      COMMON_FORMAT.DATE
    );
    const salaryPeriodEndOld = ArrayHelper.convertDateFromArray(
      oldState?.salaryPeriodEnd,
      COMMON_FORMAT.DATE
    );
    const companyNameOld = companyNameData?.find((x: any) => {
      if (x.id == oldState?.companyId) return x?.name;
    });
    const convertOldState = {
      ...oldState,
      expiredDate: ArrayHelper.convertDateFromArray(
        oldState?.expiredDate,
        COMMON_FORMAT.DATE
      ),
      savedDate: ArrayHelper.convertDateFromArray(
        oldState?.savedDate,
        COMMON_FORMAT.DATE
      ),
      periodDebt: `${
        salaryPeriodStartOld && salaryPeriodEndOld
          ? salaryPeriodStartOld + ' - ' + salaryPeriodEndOld
          : ''
      }`,
      typeDebt: oldState?.type,
      descriptionDebt: oldState?.description,
      codeDebt: oldState?.code,
      companyNameDebt: companyNameOld?.name,
    };
    delete convertOldState.salaryPeriodStart;
    delete convertOldState.salaryPeriodEnd;
    delete convertOldState.type;
    delete convertOldState.description;
    delete convertOldState.code;

    const salaryPeriodStartNew = ArrayHelper.convertDateFromArray(
      newState?.salaryPeriodStart,
      COMMON_FORMAT.DATE
    );
    const salaryPeriodEndNew = ArrayHelper.convertDateFromArray(
      newState?.salaryPeriodEnd,
      COMMON_FORMAT.DATE
    );
    const companyNameNew = companyNameData?.find((x: any) => {
      if (x.id == newState?.companyId) return x?.name;
    });
    const convertNewState = {
      ...newState,
      expiredDate: ArrayHelper.convertDateFromArray(
        newState?.expiredDate,
        COMMON_FORMAT.DATE
      ),
      savedDate: ArrayHelper.convertDateFromArray(
        newState?.savedDate,
        COMMON_FORMAT.DATE
      ),
      periodDebt: `${
        salaryPeriodStartNew && salaryPeriodEndNew
          ? salaryPeriodStartNew + ' - ' + salaryPeriodEndNew
          : ''
      }`,
      typeDebt: newState?.type,
      descriptionDebt: newState?.description,
      codeDebt: newState?.code,
      companyNameDebt: companyNameNew?.name,
    };

    delete convertNewState.salaryPeriodStart;
    delete convertNewState.salaryPeriodEnd;
    delete convertNewState.type;
    delete convertNewState.description;
    delete convertNewState.code;

    return {
      oldState: convertOldState,
      newState: convertNewState,
    };
  },
};
