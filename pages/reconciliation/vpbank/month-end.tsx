import { AppPagination, InputWrapper } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { BoxWrapper, ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { COMMON_FORMAT, TIMEZONE_FORMAT } from '@constants/common-format';
import { IconAlignBottom } from '@douyinfe/semi-icons';
import { Button, DatePicker, Select, Table } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { ReconciliationTabs } from '@modules/reconciliation/ReconciliationTabs';
import { ReconciliationService } from '@services/reconciliation';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import moment from 'moment-timezone';
import { StringHelper } from '@helpers/string.helper';
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

const tabList = [
  { tab: 'Đối soát', itemKey: 'detail' },
  { tab: 'Đối soát chốt', itemKey: 'end-month' },
];

export default function MonthEndReconciliationPage() {
  const bank = 'vpbank'.toUpperCase();
  const [filter, setFilter] = useState<any>({
    startTime: DateTimeHelper.setStartTime(new Date(), TIMEZONE_FORMAT.GMT7),
    endTime: DateTimeHelper.setEndTime(new Date(), TIMEZONE_FORMAT.GMT7),
    type: 0,
    page: 1,
    size: 10,
    fileSource: bank,
  });

  const { data, isLoading, isFetching, refetch } = useQuery(
    ['basic-config-list', filter],
    () => ReconciliationService.getListEndMonthReconciliation(filter),
    {
      // enabled: filter != null,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      page: 1,
      size: 10,
      startTime: new Date(),
      endTime: new Date(),
      type: 0,
    },
  });

  const onHandleSubmit = (values: any) => {
    setFilter({
      page: 1,
      size: 10,
      startTime: DateTimeHelper.setStartTime(
        values?.startTime,
        TIMEZONE_FORMAT.GMT7
      ),
      endTime: DateTimeHelper.setEndTime(values?.endTime, TIMEZONE_FORMAT.GMT7),
      type: values?.type,
      fileSource: bank,
    });
    refetch();
  };
  const columns = [
    {
      title: 'STT',
      width: 50,
      dataIndex: 'id',
      key: 'id',
      render: (id: any, record: any, index: any) => (
        <span>{StringHelper.indexTable(filter.page, index)}</span>
      ),
    },
    {
      title: 'File đối soát',
      dataIndex: 'filePath',
      width: 80,
      render: (e: any, record: any) => (
        <>
          <IconAlignBottom
            size="large"
            className="cursor-pointer text-blue-700"
            onClick={() => {
              const URL = `${e}`;
              if (typeof window !== 'undefined') {
                window.location.href = URL;
              }
            }}
          />
        </>
      ),
    },
    {
      title: 'Tên file đối soát',
      dataIndex: 'fileName',
      width: 260,
    },
    {
      title: 'Loại file đối soát',
      dataIndex: 'fileType',
      width: 100,
      render: (e: any) => (
        <>{e === 'BANK_MONTHLY_REPORT' ? 'Đối soát tháng' : 'Đối soát ngày'}</>
      ),
    },
    {
      title: 'Thời gian gửi file',
      dataIndex: 'createdTime',
      width: 110,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
  ];

  const getData = () => {
    if (!data?.content) return [];
    return data?.content;
  };

  return (
    <PrimaryLayout>
      <div className="px-6 pt-6">
        <div className="flex flex-col gap-4">
          <ReconciliationTabs activeItem="month-end" bank="vpbank" />

          <BoxWrapper padding={6}>
            <form
              onSubmit={handleSubmit(onHandleSubmit)}
              className="grid grid-cols-4 gap-6"
            >
              <InputWrapper
                label="Ngày bắt đầu"
                field="startTime"
                control={control}
                errors={errors}
                component={(e: any) => {
                  return (
                    <DatePicker
                      size="large"
                      className="w-full"
                      format="dd/MM/yyyy"
                      {...e}
                    />
                  );
                }}
              />

              <InputWrapper
                label="Ngày kết thúc"
                field="endTime"
                control={control}
                errors={errors}
                component={(e: any) => {
                  return (
                    <DatePicker
                      size="large"
                      className="w-full"
                      format="dd/MM/yyyy"
                      {...e}
                    />
                  );
                }}
              />

              <InputWrapper
                label="Loại đối soát"
                field="type"
                control={control}
                errors={errors}
                component={(e: any) => {
                  return (
                    <Select
                      size="large"
                      optionList={[
                        {
                          label: 'Đối soát ngày & tháng',
                          value: 0,
                        },
                        {
                          label: 'Đối soát ngày',
                          value: 1,
                        },
                        {
                          label: 'Đối soát tháng',
                          value: 2,
                        },
                      ]}
                      {...e}
                    />
                  );
                }}
              />

              <InputWrapper
                label="Hành động"
                component={(e: any) => {
                  return (
                    <Button theme="solid" htmlType="submit">
                      Tra cứu
                    </Button>
                  );
                }}
              />
            </form>
          </BoxWrapper>
        </div>
      </div>
      <ContentWrapper pageTitle="Danh sách đối soát">
        <AppTable
          size="small"
          dataSource={getData()}
          columns={columns}
          loading={isLoading || isFetching}
          renderPagination={(e: any) => {
            return (
              <div className="py-2 w-full flex justify-end">
                <AppPagination
                  {...data}
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
      </ContentWrapper>
    </PrimaryLayout>
  );
}
