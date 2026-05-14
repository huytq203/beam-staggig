import { InputWrapper } from '@components/shared';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { IconSearch } from '@douyinfe/semi-icons';
import { useAuth } from '@contexts/authentication';
import { FunctionBase } from '@helpers/fuction-base.helpers';
export const FilterTicketSalaryAdvance = (props: any) => {
  const { onFilter, companyId, refetch } = props;
  const { profile } = useAuth();
  const userRoles = profile?.roles;

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      keyword: '',
      companyId: companyId,
      ticketStatus: 'ALL',
      transactionStatus: 'ALL',
    },
  });
  const onHandleSubmit = (values: any) => {
    // if (values.companyId === undefined) {
    //   values.companyId = '';
    // }
    onFilter &&
      onFilter({
        ...values,
        keyword: FunctionBase.checkTypeofVal(values.keyword, 'string')
          ? values.keyword.trim()
          : null,
        page: 1,
        size: 10,
        companyId: companyId,
      });
    refetch();
  };
  return (
    <div>
      {/* <BoxWrapper padding={6}> */}
      <form onSubmit={handleSubmit(onHandleSubmit)} className="grid gap-6">
        <div className="grid grid-cols-2 gap-6">
          <InputWrapper
            label="Số điện thoại"
            field="keyword"
            control={control}
            errors={errors}
            component={(e: any) => {
              return (
                <Input
                  prefix={<IconSearch />}
                  showClear
                  autoComplete="off"
                  placeholder="Số điện thoại"
                  size="large"
                  {...e}
                />
              );
            }}
          />
          <InputWrapper
            label="Trạng thái giao dịch"
            field="transactionStatus"
            control={control}
            errors={errors}
            component={(e: any) => {
              return (
                <Select
                  placeholder="Trạng thái giao dịch"
                  size="large"
                  optionList={[
                    {
                      label: 'Tất cả',
                      value: 'ALL',
                    },
                    {
                      label: 'Chờ xử lý',
                      value: 'PENDING',
                    },
                    {
                      label: 'Thành công',
                      value: 'SUCCESS',
                    },
                    {
                      label: 'Lỗi',
                      value: 'FAIL',
                    },
                  ]}
                  {...e}
                />
              );
            }}
          />

          <InputWrapper
            label="Trạng thái yêu cầu"
            field="ticketStatus"
            control={control}
            errors={errors}
            component={(e: any) => {
              return (
                <Select
                  placeholder="Trạng thái yêu cầu"
                  size="large"
                  optionList={[
                    {
                      label: 'Tất cả',
                      value: 'ALL',
                    },
                    {
                      label: 'Chờ xử lý',
                      value: 'PENDING',
                    },
                    {
                      label: 'Phê duyệt',
                      value: 'ACCEPTED',
                    },
                    {
                      label: 'Từ chối',
                      value: 'REJECTED',
                    },
                    {
                      label: 'Huỷ',
                      value: 'CANCELLED',
                    },
                    // {
                    //   label: 'Lỗi',
                    //   value: 'ERROR',
                    // },
                  ]}
                  {...e}
                />
              );
            }}
          />
          {/* <InputWrapper
            label="Trạng thái"
            field="status"
            control={control}
            errors={errors}
            component={(e: any) => {
              return (
                <Select
                  placeholder="Trạng thái"
                  size="large"
                  optionList={[
                    {
                      label: 'Tất cả',
                      value: '',
                    },
                    {
                      label: 'Chờ duyệt',
                      value: 0,
                    },
                    {
                      label: 'Đã duyệt',
                      value: 1,
                    },
                    {
                      label: 'Từ chối',
                      value: 2,
                    },
                  ]}
                  {...e}
                />
              );
            }}
          />
          <InputWrapper
            field="timeType"
            label="Xem theo ngày"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select
                placeholder="Xem theo ngày"
                optionList={listDateRegister}
                size="large"
                // style={{ width: 370 }}
                {...e}
              />
            )}
          />

          <InputWrapper
            field="dateRanges"
            label="Lựa chọn thời gian"
            control={control}
            errors={errors}
            component={(e: any) => (
              <DatePicker
                size="large"
                className="w-full"
                type="dateRange"
                insetInput
                format="dd/MM/yyyy"
                {...e}
              />
            )}
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
        </div>
      </form>
      {/* </BoxWrapper> */}
    </div>
  );
};

const listDateRegister = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'REGISTER_SALARY_ADVANCE', label: 'Ngày xử lý' },
  { value: 'REGISTER_FLEX_PAY', label: 'Ngày yêu cầu' },
  { value: 'REGISTER_FLEX_PAY', label: 'Ngày chuyển tiền' },
];
