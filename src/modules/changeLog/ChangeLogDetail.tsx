import AppTable from '@components/shared/AppTable/AppTable';

import { Modal } from '@douyinfe/semi-ui';
import { ActivityLogHelper } from '@helpers/activity-log.helper';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { StringHelper } from '@helpers/string.helper';
import { BankServices } from '@services/banks';
import { ChangelogService } from '@services/changelog';
import { GroupsServices } from '@services/companies';
import React, { useEffect, useState } from 'react';
import { useQueries, useQuery } from 'react-query';
import {
  FeeSuffix,
  FeeValue,
  RangeComponent,
  WithoutFeeValue,
  WithoutRange,
} from '@components/shared';
import { ConvertLogHelper } from '@helpers/convert-log.helper';
import { COMMON_FIELD } from '@constants/changeLog.constants';
import { UserSevice } from '@services/users';
import { CampaignService } from '@services/campaigns';

enum ModelTypeEnum {
  FeePolicyTemplate = 'FeePolicyTemplate',
  FeePolicy = 'FeePolicy',
  Company = 'Company',
  Profile = 'Profile',
  EmployeeGroup = 'EmployeeGroup',
  Employee = 'Employee',
}

export const ChangeLogDetail = (props: any) => {
  const { setOpenModal, openModal, companyData, companyNameData } = props;

  const [listBank, setListBank] = useState([]);
  const [listGroup, setListGroup] = useState([]);
  const [campaignTypeCurent, setCampaignTypeCurent] = useState('');
  const [campaignTypePrevious, setCampaignTypePrevious] = useState('');

  const modelLog = openModal.modelLog;

  const logs = useQueries([
    {
      queryKey: ['logApiCore', openModal?.id],
      queryFn: () => ChangelogService.getDetailActivityLog(openModal?.id),
      enabled:
        modelLog !== 'UserEntity' &&
        openModal?.id !== undefined &&
        openModal?.id !== null,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      cacheTime: 200,
    },
    {
      queryKey: ['logApiIdentity', openModal?.id],
      queryFn: () => UserSevice.getDetailActivityLogUser(openModal?.id),
      enabled:
        modelLog == 'UserEntity' &&
        openModal?.id !== undefined &&
        openModal?.id !== null,

      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      cacheTime: 200,
    },
  ]);

  const dataLogs = logs.filter((x: any) => x.data !== undefined);

  const currentLog = dataLogs[0]?.data?.current;
  const previousLog = dataLogs[0]?.data?.previous;

  const preLogConvert = [
    {
      previousLogData: {
        data: ConvertLogHelper.convertLogFeePolicy(
          previousLog?.data,
          currentLog?.data
        ).oldState,
        model: previousLog?.model,
        modelId: previousLog?.modelId,
      },
      curentLogData: {
        data: ConvertLogHelper.convertLogFeePolicy(
          previousLog?.data,
          currentLog?.data
        ).newState,
        model: currentLog?.model,
        modelId: currentLog?.modelId,
      },
      model: 'FeePolicy',
    },
    {
      previousLogData: {
        data: ConvertLogHelper.convertLogProfile(
          previousLog?.data,
          currentLog?.data
        ).oldState,
        model: previousLog?.model,
        modelId: previousLog?.modelId,
      },
      curentLogData: {
        data: ConvertLogHelper.convertLogProfile(
          previousLog?.data,
          currentLog?.data
        ).newState,
        model: currentLog?.model,
        modelId: currentLog?.modelId,
      },
      model: 'Profile',
    },
    {
      previousLogData: {
        data: ConvertLogHelper.convertLogCompany(
          previousLog?.data,
          currentLog?.data
        ).oldState,
        model: previousLog?.model,
        modelId: previousLog?.modelId,
      },
      curentLogData: {
        data: ConvertLogHelper.convertLogCompany(
          previousLog?.data,
          currentLog?.data
        ).newState,
        model: currentLog?.model,
        modelId: currentLog?.modelId,
      },
      model: 'Company',
    },
    {
      previousLogData: {
        data: ConvertLogHelper.convertLogFeePolicyTemplate(
          previousLog?.data,
          currentLog?.data
        ).oldState,
        model: previousLog?.model,
        modelId: previousLog?.modelId,
      },
      curentLogData: {
        data: ConvertLogHelper.convertLogFeePolicyTemplate(
          previousLog?.data,
          currentLog?.data
        ).newState,
        model: currentLog?.model,
        modelId: currentLog?.modelId,
      },
      model: 'FeePolicyTemplate',
    },
    {
      previousLogData: {
        data: ConvertLogHelper.convertLogCampaign(
          previousLog?.data,
          currentLog?.data
        ).oldState,
        model: previousLog?.model,
        modelId: previousLog?.modelId,
      },
      curentLogData: {
        data: ConvertLogHelper.convertLogCampaign(
          previousLog?.data,
          currentLog?.data
        ).newState,
        model: currentLog?.model,
        modelId: currentLog?.modelId,
      },
      model: 'Campaign',
    },
    {
      previousLogData: {
        data: ConvertLogHelper.convertUserEntity(
          previousLog?.data,
          currentLog?.data
        ).oldState,
        model: previousLog?.model,
        modelId: previousLog?.modelId,
      },
      curentLogData: {
        data: ConvertLogHelper.convertUserEntity(
          previousLog?.data,
          currentLog?.data
        ).newState,
        model: currentLog?.model,
        modelId: currentLog?.modelId,
      },
      model: 'UserEntity',
    },
  ];

  const foundModel = preLogConvert.find((x: any) => {
    return x.model == currentLog?.model;
  });
  const logData = {
    previousLogData: foundModel?.previousLogData,
    curentLogData: foundModel?.curentLogData,
  };
  const previousData = foundModel ? logData.previousLogData : previousLog;
  const curentData = foundModel ? logData.curentLogData : currentLog;

  useEffect(() => {
    if (openModal?.modelLog === 'Employee') {
      BankServices.getListBanks({}).then((response: any) => {
        const dataResponse = response?.data?.data;
        setListBank(dataResponse);
      });
    }

    if (openModal?.companyId !== null && openModal?.companyId !== undefined) {
      GroupsServices.getListGroupsInComany({}, openModal?.companyId).then(
        (response) => {
          const dataResponse = response?.content;

          setListGroup(dataResponse);
        }
      );
    }

    if (openModal?.modelLog === 'Campaign' && previousData && curentData) {
      CampaignService.getDetailCampaignTypes(
        curentData?.data?.campaignTypeId
      ).then((response) => {
        setCampaignTypeCurent(response?.name);
      });
      CampaignService.getDetailCampaignTypes(
        previousData?.data?.campaignTypeId
      ).then((response) => {
        setCampaignTypePrevious(response?.name);
      });
    }
  }, [openModal?.isOpenModal, curentData, previousData]);

  const arrayModel = Object.values(ModelTypeEnum);
  const onOpenPicker = () => {
    setOpenModal({
      ...openModal,
      isOpenModal: true,
    });
  };

  const onClosePicker = () => {
    setOpenModal({
      ...openModal,
      isOpenModal: false,
    });
  };
  const getData = () => {
    const changedField = ActivityLogHelper.getChangeDetail(
      {
        currentLog: [
          'FeePolicy',
          'FeePolicyTemplate',
          'Campaign',
          'UserEntity',
          'Company',
          'Profile',
          'PayMoney',
        ].includes(currentLog?.model)
          ? currentLog
          : curentData,
        previousLog: [
          'FeePolicy',
          'FeePolicyTemplate',
          'Campaign',
          'UserEntity',
          'Company',
          'Profile',
          'PayMoney',
        ].includes(previousLog?.model)
          ? previousLog
          : previousData,
      },
      null,
      companyData,
      companyNameData
    );

    const objectChangedField = ActivityLogHelper.getChangeFields(
      changedField,
      dataLogs[0]?.data
    );

    const convertedArray = [];
    for (const item of [objectChangedField]) {
      for (const key of Object.keys(item)) {
        const valuesArray = item[key].map((element: any) => ({
          values: element.values,
        }));

        convertedArray.push({
          field: key,
          values: valuesArray,
        });
      }
    }
    if (!convertedArray) return [];
    return convertedArray;
  };

  const columns = [
    {
      title: 'Trường dữ liệu thay đổi',
      dataIndex: 'field',
      with: 180,
      render: (e: any, record: any) => (
        <p className="beam-break-world">
          {FunctionBase.getFieldProperty(record.field, COMMON_FIELD)?.text}
        </p>
      ),
    },
    {
      title: 'Giá trị cũ',
      dataIndex: 'old',
      with: 250,
      render: (e: any, record: any) => {
        const changeData = record.values?.map((x: any) => {
          return x.values;
        });
        const convertData = changeData.reduce((obj: any, item: any) => {
          if (changeData.length < 2 && record.field !== 'groups') {
            obj.old = item.old;
            obj.new = item.new;
            return obj;
          } else {
            if (!obj.old) {
              obj.old = []; // Initialize 'old' as an empty array
            }
            obj.old.push(item.old);
            if (!obj.new) {
              obj.new = []; // Initialize 'new' as an empty array
            }
            obj.new.push(item.new);
            return obj;
          }
        }, {});

        let getBankName: any;
        let getGroupName: any;
        let getGroupPaylimit: any;
        let typeofFee: any;
        if (
          FunctionBase.getFieldProperty(record.field, COMMON_FIELD)?.text ===
          'Tên ngân hàng'
        ) {
          const getBank: any = listBank?.filter((cur: any) => {
            return (
              cur.bankCode ==
              FunctionBase.getDataProperty(
                record.field,
                COMMON_FIELD,
                convertData?.old
              ).convertData(convertData?.old)
            );
          });
          getBankName = getBank[0]?.bankName;
        }

        if (
          FunctionBase.getFieldProperty(record.field, COMMON_FIELD)?.text ===
          'Quy tắc ứng'
        ) {
          const getGroup: any = listGroup?.filter((cur: any) => {
            return (
              cur.id ==
              FunctionBase.getDataProperty(
                record.field,
                COMMON_FIELD,
                convertData?.old
              ).convertData(convertData?.old)
            );
          });
          getGroupName = getGroup[0]?.name;
          getGroupPaylimit = getGroup[0]?.payLimitSalary;
        }
        const previous = logData.previousLogData?.data;
        // const preFeeRangeValueType = previous?.feeRangeValueType.split(':');
        return (
          <>
            {(() => {
              switch (true) {
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Tên ngân hàng':
                  return <p>{getBankName}</p>;
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Quy tắc ứng':
                  return (
                    <p>
                      {getGroupName && getGroupPaylimit
                        ? `${getGroupName} (${getGroupPaylimit}%)`
                        : getGroupName && !getGroupPaylimit
                        ? `${getGroupName}`
                        : 'Mặc định'}
                    </p>
                  );
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Trạng thái' && previousData?.model == 'Employee':
                  return (
                    <p>
                      {FunctionBase.getDataProperty(
                        record.field,
                        COMMON_FIELD,
                        convertData?.old
                      ).convertData(convertData?.old) === 'Hoạt động'
                        ? 'Đang làm việc'
                        : 'Đã nghỉ việc'}
                    </p>
                  );
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Loại chiến dịch' &&
                  previousData?.model == 'Campaign':
                  return <p>{campaignTypePrevious}</p>;
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Giá trị' &&
                  arrayModel.includes(previousData?.model):
                  return (
                    <p>
                      {previousData?.data?.feeType == 1 ? (
                        <WithoutFeeValue
                          feeRange={JSON.parse(previous?.feeRange)}
                          feeRangeType={JSON.parse(previous?.feeRangeType)}
                          feeValue={JSON.parse(previous?.feeValue)}
                        />
                      ) : (
                        <span>
                          {JSON.parse(previous?.feeRangeType)[0] == 0
                            ? StringHelper.formatVND(
                                JSON.parse(previous?.feeValue)[0]
                              )
                            : JSON.parse(previous?.feeValue)[0]}{' '}
                          {JSON.parse(previous?.feeRangeType)[0] != 0 && '%'}
                        </span>
                      )}
                    </p>
                  );
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Giá trị phí' &&
                  arrayModel.includes(previousData?.model):
                  return (
                    <p>
                      {previousData?.data?.feeType == 1 ? (
                        <WithoutRange
                          feeRange={JSON.parse(
                            previous?.feeRangeValueType.split(':')[0]
                          )}
                          feeRangeType={JSON.parse(
                            previous?.feeRangeValueType.split(':')[1]
                          )}
                          feeValue={JSON.parse(previous?.feeValue)}
                        />
                      ) : (
                        <span>
                          <FeeValue
                            type={JSON.parse(previous?.feeRangeType)[0]}
                            value={JSON.parse(previous?.feeValue)[0]}
                          />
                          <FeeSuffix
                            type={JSON.parse(previous?.feeRangeType)[0]}
                          />
                        </span>
                      )}
                    </p>
                  );
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Doanh nghiệp chia sẻ phí' &&
                  arrayModel.includes(previousData?.model):
                  return (
                    <p>
                      {previousData?.data?.feeSharingType == 0
                        ? StringHelper.formatVND(
                            FunctionBase.getDataProperty(
                              record.field,
                              COMMON_FIELD,
                              convertData?.old
                            ).convertData(convertData?.old)
                          )
                        : `${FunctionBase.getDataProperty(
                            record.field,
                            COMMON_FIELD,
                            convertData?.old
                          ).convertData(convertData?.old)}%`}
                    </p>
                  );
                default:
                  return (
                    <p className="beam-break-world">
                      {FunctionBase.getDataProperty(
                        record.field,
                        COMMON_FIELD,
                        convertData?.old
                      ).convertData(convertData?.old)}
                    </p>
                  );
              }
            })()}
          </>
        );
      },
    },
    {
      title: 'Giá trị thay đổi',
      dataIndex: 'new',
      with: 250,
      render: (e: any, record: any) => {
        const changeData = record.values?.map((x: any) => {
          return x.values;
        });
        const convertData = changeData.reduce((obj: any, item: any) => {
          if (changeData.length < 2 && record.field !== 'groups') {
            obj.old = item.old;
            obj.new = item.new;
            return obj;
          } else {
            if (!obj.old) {
              obj.old = []; // Initialize 'old' as an empty array
            }
            obj.old.push(item.old);
            if (!obj.new) {
              obj.new = []; // Initialize 'new' as an empty array
            }
            obj.new.push(item.new);
            return obj;
          }
        }, {});
        let getBankName: any;
        let getGroupName: any;
        let getGroupPaylimit: any;
        if (
          FunctionBase.getFieldProperty(record.field, COMMON_FIELD)?.text ===
          'Tên ngân hàng'
        ) {
          const getBank: any = listBank?.filter((cur: any) => {
            return (
              cur.bankCode ==
              FunctionBase.getDataProperty(
                record.field,
                COMMON_FIELD,
                convertData?.new
              ).convertData(convertData?.new)
            );
          });
          getBankName = getBank[0]?.bankName;
        }
        if (
          FunctionBase.getFieldProperty(record.field, COMMON_FIELD)?.text ===
          'Quy tắc ứng'
        ) {
          const getGroup: any = listGroup?.filter((cur: any) => {
            return (
              cur.id ==
              FunctionBase.getDataProperty(
                record.field,
                COMMON_FIELD,
                convertData?.new
              ).convertData(convertData?.new)
            );
          });

          getGroupName = getGroup[0]?.name;
          getGroupPaylimit = getGroup[0]?.payLimitSalary;
        }
        const current = logData.curentLogData?.data;
        // const curentFeeRangeValueType = current?.feeRangeValueType.split(':');
        return (
          <>
            {(() => {
              switch (true) {
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Tên ngân hàng':
                  return <p>{getBankName}</p>;
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Quy tắc ứng':
                  return (
                    <p>
                      {getGroupName && getGroupPaylimit
                        ? `${getGroupName} (${getGroupPaylimit}%)`
                        : getGroupName && !getGroupPaylimit
                        ? `${getGroupName}`
                        : 'Mặc định'}
                    </p>
                  );
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Trạng thái' && curentData?.model == 'Employee':
                  return (
                    <p>
                      {FunctionBase.getDataProperty(
                        record.field,
                        COMMON_FIELD,
                        convertData?.new
                      ).convertData(convertData?.new) === 'Hoạt động'
                        ? 'Đang làm việc'
                        : 'Đã nghỉ việc'}
                    </p>
                  );
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Loại chiến dịch' &&
                  curentData?.model == 'Campaign':
                  return <p>{campaignTypeCurent}</p>;
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Giá trị' &&
                  arrayModel.includes(curentData?.model):
                  return (
                    <p>
                      {current?.feeType == 1 ? (
                        <WithoutFeeValue
                          feeRange={JSON.parse(current?.feeRange)}
                          feeRangeType={JSON.parse(current?.feeRangeType)}
                          feeValue={JSON.parse(current?.feeValue)}
                        />
                      ) : (
                        <span>
                          {JSON.parse(current?.feeRangeType)[0] == 0
                            ? StringHelper.formatVND(
                                JSON.parse(current?.feeValue)[0]
                              )
                            : JSON.parse(current?.feeValue)[0]}{' '}
                          {JSON.parse(current?.feeRangeType)[0] != 0 && '%'}
                        </span>
                      )}
                    </p>
                  );
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Giá trị phí' &&
                  arrayModel.includes(curentData?.model):
                  return (
                    <p>
                      {current?.feeType == 1 ? (
                        <WithoutRange
                          feeRange={JSON.parse(current?.feeRange)}
                          feeRangeType={JSON.parse(
                            current?.feeRangeValueType.split(':')[1]
                          )}
                          feeValue={JSON.parse(
                            current?.feeRangeValueType.split(':')[0]
                          )}
                        />
                      ) : (
                        <span>
                          {JSON.parse(current?.feeRangeType)[0] == 0
                            ? StringHelper.formatVND(
                                JSON.parse(current?.feeValue)[0]
                              )
                            : JSON.parse(current?.feeValue)[0]}{' '}
                          {JSON.parse(current?.feeRangeType)[0] != 0 && '%'}
                        </span>
                      )}
                    </p>
                  );
                case FunctionBase.getFieldProperty(record.field, COMMON_FIELD)
                  ?.text === 'Doanh nghiệp chia sẻ phí' &&
                  arrayModel.includes(curentData?.model):
                  return (
                    <p>
                      {curentData?.data?.feeSharingType == 0
                        ? StringHelper.formatVND(
                            FunctionBase.getDataProperty(
                              record.field,
                              COMMON_FIELD,
                              convertData?.new
                            ).convertData(convertData?.new)
                          )
                        : `${FunctionBase.getDataProperty(
                            record.field,
                            COMMON_FIELD,
                            convertData?.new
                          ).convertData(convertData?.new)}%`}
                    </p>
                  );
                default:
                  return (
                    <p className="beam-break-world">
                      {FunctionBase.getDataProperty(
                        record.field,
                        COMMON_FIELD,
                        convertData?.new
                      ).convertData(convertData?.new)}
                    </p>
                  );
              }
            })()}
          </>
        );
      },
    },
  ];
  return (
    <>
      <Modal
        visible={openModal?.isOpenModal}
        onCancel={onClosePicker}
        title="Chi tiết lịch sử thay đổi"
        footer={['']}
        width={1200}
        bodyStyle={{
          overflow: 'auto',
        }}
      >
        <AppTable
          dataSource={getData()}
          columns={columns}
          empty="Không có thay đổi nào"
        />
      </Modal>
    </>
  );
};
