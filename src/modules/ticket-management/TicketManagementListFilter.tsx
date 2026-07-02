import { InputWrapper } from '@components/shared';
import { BoxWrapper } from '@components/widgets';
import { Button, DatePicker, Input } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IconSearch } from '@douyinfe/semi-icons';
import { DateTimeHelper } from '@helpers/date-time.helper';
import moment from 'moment';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { ExportTicketManagementListButton } from './ExporTicketManagementListButton';
import { TIMEZONE_FORMAT } from '@constants/common-format';
export const TicketManagementFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const [exportDate, setExportDate] = useState({});
  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchKey: '',
      type: 'INFORMATION',
      status: 0,
      dateRanges: [],
    },
  });
  useEffect(() => {
    setExportDate({
      endDate: watch('dateRanges')[1]
        ? DateTimeHelper.setEndTime(
            moment(watch('dateRanges')[1]),
            TIMEZONE_FORMAT.GMT7
          )
            .tz(TIMEZONE_FORMAT.GMT0)
            .format()
        : '',
      startDate: DateTimeHelper.fomartDateRangeSubmit(watch('dateRanges')[0]),
      keyword: watch('searchKey').trim(),
      groupId: '',
    });
  }, [watch('dateRanges'), watch('searchKey')]);
  const onHandleSubmit = (values: any) => {
    if (values.companyId === undefined) {
      values.companyId = '';
    }

    onFilter &&
      onFilter({
        // ...values,
        searchKey: FunctionBase.checkTypeofVal(values.searchKey, 'string')
          ? values?.searchKey?.trim()
          : '',
        page: 1,
        size: 10,
        endDate: values.dateRanges[1]
          ? DateTimeHelper.setEndTime(
              moment(watch('dateRanges')[1]),
              TIMEZONE_FORMAT.GMT7
            )
              .tz(TIMEZONE_FORMAT.GMT0)
              .format()
          : '',
        startDate: DateTimeHelper.fomartDateRangeSubmit(values.dateRanges[0]),
      });
    refetch();
  };
  return (
    <div>
      <BoxWrapper padding={6}>
        <div>
          <p className="font-bold text-2xl mb-4">Quản lý yêu cầu</p>
        </div>
        <form onSubmit={handleSubmit(onHandleSubmit)} className="grid gap-6">
          <div className="grid grid-cols-2 gap-6">
            <InputWrapper
              label="Tên doanh nghiệp/Mã số thuế"
              field="searchKey"
              control={control}
              errors={errors}
              component={(e: any) => {
                return (
                  <Input
                    prefix={<IconSearch />}
                    showClear
                    autoComplete="off"
                    placeholder="Tên doanh nghiệp/Mã số thuế"
                    size="large"
                    {...e}
                  />
                );
              }}
            />
            <InputWrapper
              label="Ngày đăng ký"
              field="dateRanges"
              control={control}
              errors={errors}
              component={(e: any) => {
                return (
                  <DatePicker
                    size="large"
                    className="w-full"
                    type="dateRange"
                    insetInput
                    format="dd/MM/yyyy"
                    {...e}
                  />
                );
              }}
            />

            {/* <InputWrapper
              label="Loại yêu cầu"
              field="type"
              control={control}
              errors={errors}
              component={(e: any) => {
                return (
                  <Select
                    placeholder="Loại yêu cầu"
                    size="large"
                    optionList={[
                      {
                        label: 'Đăng ký công ty mới',
                        value: 'INFORMATION',
                      },
                      // {
                      //   label: 'Đăng ký dịch vụ ứng lương',
                      //   value: 'SALARY_ADVANCE',
                      // },
                      // {
                      //   label: 'Khác',
                      //   value: 2,
                      // },
                    ]}
                    {...e}
                  />
                );
              }}
            /> */}

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
            <InputWrapper
              label="Xuất dữ liệu"
              component={(e: any) => {
                return <ExportTicketManagementListButton filter={exportDate} />;
              }}
            />
          </div>
        </form>
      </BoxWrapper>
    </div>
  );
};
