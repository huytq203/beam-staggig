import { ActivityLogCompare } from '@constants/models/activity-log';
import { ConvertLogHelper } from './convert-log.helper';

enum ExceptFieldsEnum {
  id = 'id',
  changedInformation = 'changedInformation',
  updatedAt = 'updatedAt',
  updatedBy = 'updatedBy',
  createdAt = 'createdAt',
  createdBy = 'createdBy',
  company = 'company',
  bank = 'bank',
  constraintShortName = 'constraintShortName',
  logo = 'logo',
  verifiedInformationTime = 'verifiedInformationTime',
  otpregisterSalaryAdvance = 'otpregisterSalaryAdvance',
  registerSalaryAdvanceTimes = 'registerSalaryAdvanceTimes',
  verifiedInformation = 'verifiedInformation',
  companyId = 'companyId',
  payLimitSalaryType = 'payLimitSalaryType',
  normalizedName = 'normalizedName',
  registerFlexpay = 'registerFlexpay',
  registerFlexpayTime = 'registerFlexpayTime',
  termVerified = 'termVerified',
  termVerifiedTime = 'termVerifiedTime',
  companyCode = 'companyCode',
  employees = 'employees',
  termsForm = 'termsForm',
  feePolicyTemplate = 'feePolicyTemplate',
  index = 'index',
  feePolicyTemplateId = 'feePolicyTemplateId',
  feePolicyTemplateName = 'feePolicyTemplateName',
  feeValue = 'feeValue',
  feeRangeType = 'feeRangeType',
  companyEmployeeId = 'companyEmployeeId',
  member = 'member',
  totalSpending = 'totalSpending',
  used = 'used',
  integrationType = 'integrationType',
  createdTimestamp = 'createdTimestamp',
  lastUploadEmployee = 'lastUploadEmployee',
  lastUpload = 'lastUpload',
  payLimitEnabledByDate = 'payLimitEnabledByDate',
  isUpdatedByBeamAdmin = 'isUpdatedByBeamAdmin',
  isUpdatedByAccountant = 'isUpdatedByAccountant',
  inPeriod = 'inPeriod',
  overdue = 'overdue',
  credit = 'credit',
  debit = 'debit',
  deletedAt = 'deletedAt',
  updatedByUsername = 'updatedByUsername',
}

enum ModelTypeEnum {
  FeePolicyTemplate = 'FeePolicyTemplate',
  FeePolicy = 'FeePolicy',
  Company = 'Company',
  Profile = 'Profile',
  EmployeeGroup = 'EmployeeGroup',
  Employee = 'Employee',
  PayMoney = 'PayMoney',
}

export const ActivityLogHelper = {
  getChangeDetail: (
    activityLog: ActivityLogCompare,
    filterFields?: string[] | null,
    companyData?: any,
    companyNameData?: any
  ) => {
    const exceptFields = Object.keys(ExceptFieldsEnum);

    const getObjectDiff = (obj1: any, obj2: any, filterFields: any = null) => {
      let obj1Props: any[] = [];
      if (obj1) {
        obj1Props = Object?.keys(obj1).filter((x: any) => {
          return (
            (!filterFields && !exceptFields.includes(x)) ||
            (filterFields && filterFields.includes(x))
          );
        });
      }
      const obj2Props = Object?.keys(obj2 || {}).filter(
        (x: any) =>
          (!filterFields && !exceptFields.includes(x)) ||
          (filterFields && filterFields.includes(x))
      );
      let fuckArr: any = [];
      const keysWithDiffValue = obj1Props.reduce(
        (keysWithDiffValueAccumulator, key) => {
          const propExistsOnObj2 = obj2.hasOwnProperty(key);
          const hasNestedValue =
            obj1[key] instanceof Object && obj2[key] instanceof Object;
          const keyValuePairBetweenBothObjectsIsEqual = obj1[key] === obj2[key];

          if (!propExistsOnObj2) {
            keysWithDiffValueAccumulator.push(key);
          } else if (hasNestedValue) {
            const keyIndex = keysWithDiffValueAccumulator.indexOf(key);
            if (keyIndex >= 0) {
              keysWithDiffValueAccumulator.splice(keyIndex, 1);
            }
            const nestedDiffs = getObjectDiff(
              obj1[key],
              obj2[key],
              filterFields
            );
            for (let diff of nestedDiffs) {
              fuckArr.push({
                key: key,
                child: diff,
              });
              keysWithDiffValueAccumulator.push(`${key}.${diff}`);
            }
          } else if (keyValuePairBetweenBothObjectsIsEqual) {
            const equalValueKeyIndex =
              keysWithDiffValueAccumulator.indexOf(key);
            keysWithDiffValueAccumulator.splice(equalValueKeyIndex, 1);
          }

          return keysWithDiffValueAccumulator;
        },
        obj2Props
      );
      return keysWithDiffValue;
    };
    const getValueByKey = (path: any, obj = self, separator = '.') => {
      var properties = Array.isArray(path) ? path : path.split(separator);
      return properties.reduce((prev: any, curr: any) => prev?.[curr], obj);
    };

    const previousLog = activityLog?.previousLog;
    const currentLog = activityLog?.currentLog;
    const oldState: any = previousLog?.data;
    const newState: any = currentLog?.data;

    const logStateArray = [
      {
        model: 'Profile',
        oldState: ConvertLogHelper.convertLogProfile(oldState, newState)
          .oldState,
        newState: ConvertLogHelper.convertLogProfile(oldState, newState)
          .newState,
      },
      {
        model: 'Company',
        oldState: ConvertLogHelper.convertLogCompany(oldState, newState)
          .oldState,
        newState: ConvertLogHelper.convertLogCompany(oldState, newState)
          .newState,
      },
      {
        model: 'Employee',
        oldState: ConvertLogHelper.convertLogEmployee(
          oldState,
          newState,
          companyData
        ).oldState,
        newState: ConvertLogHelper.convertLogEmployee(
          oldState,
          newState,
          companyData
        ).newState,
      },
      {
        model: 'EmployeeGroup',
        oldState: oldState,
        newState: newState,
      },
      {
        model: 'FeePolicy',
        oldState: ConvertLogHelper.convertLogFeePolicy(oldState, newState)
          .oldState,
        newState: ConvertLogHelper.convertLogFeePolicy(oldState, newState)
          .newState,
      },
      {
        model: 'FeePolicyTemplate',
        oldState: ConvertLogHelper.convertLogFeePolicyTemplate(
          oldState,
          newState
        ).oldState,
        newState: ConvertLogHelper.convertLogFeePolicyTemplate(
          oldState,
          newState
        ).newState,
      },
      {
        model: 'Campaign',
        oldState: ConvertLogHelper.convertLogCampaign(oldState, newState)
          .oldState,
        newState: ConvertLogHelper.convertLogCampaign(oldState, newState)
          .newState,
      },
      {
        model: 'UserEntity',
        oldState: ConvertLogHelper.convertUserEntity(oldState, newState)
          .oldState,
        newState: ConvertLogHelper.convertUserEntity(oldState, newState)
          .newState,
      },
      {
        model: 'PaymentSendingMethod',
        oldState: ConvertLogHelper.convertLogPayMoney(oldState, newState)
          .oldState,
        newState: ConvertLogHelper.convertLogPayMoney(oldState, newState)
          .newState,
      },
      {
        model: 'AccountingEntry',
        oldState: ConvertLogHelper.convertLogAccounting(
          oldState,
          newState,
          companyNameData
        ).oldState,
        newState: ConvertLogHelper.convertLogAccounting(
          oldState,
          newState,
          companyNameData
        ).newState,
      },
      {
        model: 'PaymentSendingMethodDefault',
        oldState: ConvertLogHelper.convertLogSendingBankStatus(
          oldState,
          newState
        ).oldState,
        newState: ConvertLogHelper.convertLogSendingBankStatus(
          oldState,
          newState
        ).newState,
      },
    ];

    const foundModel = logStateArray.find(
      (x: any) => x.model == currentLog?.model
    );

    let oldStateConvert = foundModel?.oldState;

    let newStateConvert = foundModel?.newState;
    const listFieldChanges: any[] = getObjectDiff(
      oldStateConvert,
      newStateConvert,
      filterFields
    );

    const results = listFieldChanges.map((field: any) => {
      const oldValue: any = getValueByKey(field, oldStateConvert) ?? null;
      const newValue: any = getValueByKey(field, newStateConvert) ?? null;

      return {
        field: field,
        values: {
          old: oldValue,
          new: newValue,
        },
      };
    });
    return results;
  },
  getChangeFields: (fields: any, activityLog: any) => {
    const oldState: any = activityLog?.previous?.data;
    const newState: any = activityLog?.current?.data;
    let tempFields = fields?.map((x: any) => {
      return {
        root: x.field.split('.')[0],
        field: x.field,
        values: x.values,
      };
    });

    const groupBy = function (xs: any, key: any) {
      return xs.reduce(function (rv: any, x: any) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };

    let results = groupBy(tempFields, 'root');
    if (results.hasOwnProperty('groups')) {
      results.groups = [
        {
          root: 'groups',
          field: 'groups',
          values: {
            old: oldState?.groups,
            new: newState?.groups,
          },
        },
      ];
    }
    if (results.hasOwnProperty('groupApplyName')) {
      results.groupApplyName = [
        {
          root: 'groupApplyName',
          field: 'groupApplyName',
          values: {
            old: oldState?.groupIds,
            new: newState?.groupIds,
          },
        },
      ];
    }
    if (results.hasOwnProperty('companies')) {
      results.companies = [
        {
          root: 'companies',
          field: 'companies',
          values: {
            old: oldState?.companies,
            new: newState?.companies,
          },
        },
      ];
    }
    if (results.hasOwnProperty('eligibleCompanyNames')) {
      results.eligibleCompanyNames = [
        {
          root: 'eligibleCompanyNames',
          field: 'eligibleCompanyNames',
          values: {
            old: oldState?.companies.eligibleCompanyNames,
            new: newState?.companies.eligibleCompanyNames,
          },
        },
      ];
    }
    return results;
  },
};
