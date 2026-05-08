import AppTable from '@components/shared/AppTable/AppTable';
import { AppPagination } from '@components/shared';
import { Tooltip, Typography } from '@douyinfe/semi-ui';
import { ActivityLogHelper } from '@helpers/activity-log.helper';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { ChangelogService } from '@services/changelog';
import { useQueries, useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { StringHelper } from '@helpers/string.helper';
import { useState } from 'react';
import { IconEyeOpened } from '@douyinfe/semi-icons';
import { ChangeLogDetail } from './ChangeLogDetail';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { COMMON_FIELD } from '@constants/changeLog.constants';
import { UserSevice } from '@services/users';
import { CompanyService } from '@services/companies';

export const ChangeLogList = (props: any) => {
  const router = useRouter();

  const { model, modelId } = router.query;
  const { Text } = Typography;
  const [filter, setFilter] = useState({
    startTime: '',
    endTime: '',
    processBy: '',
    page: 1,
    size: 10,
    sort: ['createdAt,desc'],
  });
  const [openModal, setOpenModal] = useState({
    isOpenModal: false,
    id: null,
    modelLog: model,
    companyId: null,
  });
  const { data, isLoading, refetch } = useQuery(
    ['logs', filter],
    () =>
      ChangelogService.getListActivityLog({
        ...filter,
        model: model,
        modelId: modelId,
      }),
    {
      enabled: model !== 'UserEntity',
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const logs = useQueries([
    {
      queryKey: ['logApiCore', filter],
      queryFn: () =>
        ChangelogService.getListActivityLog({
          ...filter,
          model: model,
          modelId: modelId,
        }),
      enabled: model !== 'UserEntity',
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      cacheTime: 200,
    },
    {
      queryKey: ['logApiIdentity', filter],
      queryFn: () =>
        UserSevice.getListActivityLogUser({
          ...filter,
          model: model,
          modelId: modelId,
        }),
      enabled: model == 'UserEntity',
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      cacheTime: 200,
    },
  ]);
  const { data: companyData } = useQuery(
    ['company', filter],
    () =>
      CompanyService.getCompany(
        logs[0]?.data?.data?.content?.[0]?.data?.companyId
      ),
    {
      enabled:
        model === 'Employee' &&
        logs[0]?.data?.data?.content?.[0]?.data?.companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const { data: companyNameData } = useQuery(
    ['companyName', filter],
    () => CompanyService.getAllCompaniesDropdown({}),
    {
      enabled: model === 'AccountingEntry',
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const dataLogs = logs.filter((x: any) => x.data !== undefined);

  const changeLogContent = (record: any, index: any) => {
    const current = record;
    const previous =
      index < 9
        ? dataLogs[0]?.data?.data?.content[index + 1]
        : dataLogs[0]?.data?.previousData;
    const changedField = ActivityLogHelper.getChangeDetail(
      {
        currentLog: current,
        previousLog: previous,
      },
      null,
      companyData,
      companyNameData
    );
    const processedChangeField = ActivityLogHelper.getChangeFields(
      changedField,
      data
    );
    const objectChangedField = Object.keys(processedChangeField);
    return objectChangedField;
  };

  if (isLoading) return <></>;

  const convertReason = (field: any) => {
    const ticketErrorReason: any = {
      CREATE: 'Khởi tạo',
      UPDATE: 'Cập nhật',
      IMPORT_FILE: 'Tải lên tệp',
      MIGRATE_DATA_NEXT_PERIOD: 'Cập nhật cho kỳ mới',
      CHANGE_SALARY_ADVANCE: 'Chuyển trạng thái ứng lương',
      TICKET_INFORMATION: 'Yêu cầu thay đổi thông tin',
      TICKET_SALARY_ADVANCE: 'Yêu cầu đăng ký ứng lương',
      BLOCK_COMPANY: 'Tạm khoá ứng lương công ty',
      OPEN_COMPANY: 'Mở khoá ứng lương công ty',
      API_MIGRATE: 'Đồng bộ API',
      SCHEDULE_BLOCK_UNBLOCK_COMPANY: 'Mở/khoá ứng lương công ty',
      REGISTER_SALARY_ADVANCE: 'Đăng ký ứng lương ',
      DEREGISTER_SALARY_ADVANCE: 'Huỷ đăng ký dịch vụ ứng lương',
    };

    if (!ticketErrorReason[field]) return field;
    return ticketErrorReason[field];
  };

  const checkChangeLog = (functionName: string, model: string, preLog: any) => {
    if (!dataLogs[0]) return false;
    const funcNameArr = [
      'CREATE',
      'IMPORT_FILE',
      'MIGRATE_DATA_NEXT_PERIOD',
      'API_MIGRATE',
    ];
    return !(funcNameArr.includes(functionName) && preLog === undefined);
  };
  return (
    <div className="p-5">
      <AppTable
        columns={[
          {
            dataIndex: 'id',
            title: 'STT',
            width: 80,
            render: (name: any, record: any, index: any) => {
              return (
                <Text>
                  <span>{StringHelper.indexTable(filter.page, index)}</span>
                </Text>
              );
            },
          },
          {
            dataIndex: 'createdBy',
            title: 'Người cập nhật',
            width: 130,
            render: (e: any) => <p>{e === 'SCHEDULE' ? 'Hệ thống' : e}</p>,
          },
          {
            dataIndex: 'createdAt',
            title: 'Ngày cập nhật',
            width: 150,
            render: (e: any, record: any) => {
              return (
                <>
                  {DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}
                </>
              );
            },
          },
          {
            dataIndex: 'functionName',
            title: 'Loại thay đổi',
            width: 150,
            render: (e: any) => {
              return <p className="beam-break-world">{convertReason(e)}</p>;
            },
          },
          {
            dataIndex: 'data',
            title: 'Nội dung thay đổi',
            width: 200,
            render: (e: any, record: any, index: any) => {
              let flag = checkChangeLog(
                record.functionName,
                record.model,
                dataLogs[0]?.data?.data?.content[index + 1]
              );
              return (
                <div className="flex gap-4">
                  <Tooltip
                    position="top"
                    content={
                      flag
                        ? changeLogContent(record, index)
                            .map(
                              (x: any) =>
                                FunctionBase.getFieldProperty(x, COMMON_FIELD)
                                  ?.text
                            )
                            .join(', ')
                        : ''
                    }
                  >
                    <Text>
                      <p className="line-clamp-1">
                        {flag
                          ? changeLogContent(record, index)
                              .map(
                                (x: any) =>
                                  FunctionBase.getFieldProperty(x, COMMON_FIELD)
                                    ?.text
                              )
                              .join(', ')
                          : ''}
                      </p>
                    </Text>
                  </Tooltip>
                </div>
              );
            },
          },
          {
            dataIndex: 'id',
            title: 'Xem chi tiết',
            width: 80,
            render: (id: any, record: any, index: any) => {
              let flag =
                checkChangeLog(
                  record.functionName,
                  record.model,
                  dataLogs[0]?.data?.data?.content[index + 1]
                ) || changeLogContent(record, index)?.length < 1;
              return (
                <>
                  {flag ? (
                    <IconEyeOpened
                      onClick={() =>
                        setOpenModal({
                          isOpenModal: true,
                          id: id,
                          modelLog: model,
                          companyId: record?.data.companyId,
                        })
                      }
                      className="cursor-pointer"
                    />
                  ) : (
                    ''
                  )}
                </>
              );
            },
          },
        ]}
        empty="Không có thay đổi nào"
        dataSource={dataLogs[0]?.data?.data?.content}
        renderPagination={(e: any) => {
          return (
            <div className="py-2 w-full flex justify-end">
              <AppPagination
                {...dataLogs[0]?.data?.data}
                onChange={(e: any) => {
                  setFilter({
                    ...filter,
                    page: e,
                  });
                }}
              />
            </div>
          );
        }}
      />
      <ChangeLogDetail
        setOpenModal={setOpenModal}
        openModal={openModal}
        companyData={companyData}
        companyNameData={companyNameData}
      />
    </div>
  );
};
