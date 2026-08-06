import { CompanySelect } from '@components/widgets';
import { COMMON_FORMAT } from '@constants/common-format';
import {
  dateRegisterUser,
  listSortStatusBoolean,
} from '@constants/select-options.constants';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { accountLockedFilterOptions } from '../constants';
export const UserFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      searchWord: '',
      page: 1,
      size: 10,
      companyId: '',
      status: '',
      dateType: 3,
      dateRanges: [],
      accountLocked: '',
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      searchWord: '',
    });
  }, []);
  const onSubmitValues = (values: any) => {
    if (values.status === 3) {
      delete values.status;
      refetch();
      return onFilter({
        ...values,
        name: values.name.trim(),
      });
    }
    refetch();
    return onFilter({
      searchWord: values.searchWord.trim(),
      page: 1,
      size: 10,
      dateType: values.dateType == 3 ? '' : values.dateType,
      startDate: values.dateRanges[0]
        ? moment(values.dateRanges[0]).format(
            COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
          )
        : '',
      endDate: values.dateRanges[1]
        ? moment(values.dateRanges[1]).format(
            COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
          )
        : '',
      companyId: values.companyId ? values.companyId : '',
      status: values.status,
      ...(values.accountLocked === ''
        ? {}
        : { accountLocked: values.accountLocked === 'true' }),
    });
  };
  return (
    <form
      className="rounded-lg bg-gray-50 p-4"
      onSubmit={handleSubmit(onSubmitValues)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 xl:items-end">
        <div className="min-w-0 space-y-2 md:col-span-2 xl:col-span-3">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="user-filter-search"
          >
            Tìm kiếm
          </label>
          <Controller
            name="searchWord"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="user-filter-search"
                className="w-full"
                size="large"
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="Tên, mã nhân viên, số điện thoại hoặc email"
              />
            )}
          />
        </div>

        <div className="min-w-0 space-y-2 md:col-span-2 xl:col-span-3">
          <label
            id="user-filter-company-label"
            className="block text-sm font-medium text-gray-700"
            htmlFor="user-filter-company"
          >
            Doanh nghiệp
          </label>
          <Controller
            name="companyId"
            control={control}
            render={({ field }) => (
              <CompanySelect
                {...field}
                id="user-filter-company"
                aria-labelledby="user-filter-company-label"
                className="w-full"
                size="large"
                showClear
                placeholder="Chọn doanh nghiệp, mã DN hoặc MST"
              />
            )}
          />
        </div>

        <div className="min-w-0 space-y-2 xl:col-span-3">
          <label
            id="user-filter-status-label"
            className="block text-sm font-medium text-gray-700"
            htmlFor="user-filter-status"
          >
            Trạng thái hoạt động
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="user-filter-status"
                aria-labelledby="user-filter-status-label"
                className="w-full"
                placeholder="Trạng thái"
                size="large"
                optionList={listSortStatusBoolean}
              />
            )}
          />
        </div>

        <div className="min-w-0 space-y-2 xl:col-span-3">
          <label
            id="user-filter-account-locked-label"
            className="block text-sm font-medium text-gray-700"
            htmlFor="user-filter-account-locked"
          >
            Trạng thái khóa
          </label>
          <Controller
            name="accountLocked"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="user-filter-account-locked"
                aria-labelledby="user-filter-account-locked-label"
                className="w-full"
                size="large"
                showClear
                optionList={accountLockedFilterOptions}
              />
            )}
          />
        </div>

        <div className="min-w-0 space-y-2 xl:col-span-3">
          <label
            id="user-filter-date-type-label"
            className="block text-sm font-medium text-gray-700"
            htmlFor="user-filter-date-type"
          >
            Loại ngày
          </label>
          <Controller
            name="dateType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="user-filter-date-type"
                aria-labelledby="user-filter-date-type-label"
                className="w-full"
                placeholder="Chọn ngày"
                size="large"
                optionList={dateRegisterUser}
              />
            )}
          />
        </div>

        <div className="min-w-0 space-y-2 xl:col-span-6">
          <label
            id="user-filter-date-ranges-label"
            className="block text-sm font-medium text-gray-700"
          >
            Khoảng thời gian
          </label>
          <Controller
            name="dateRanges"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                aria-labelledby="user-filter-date-ranges-label"
                size="large"
                className="w-full"
                type="dateRange"
                insetInput
                format="dd/MM/yyyy"
              />
            )}
          />
        </div>

        <div className="flex md:col-span-2 md:justify-end xl:col-span-3">
          <Button
            icon={<IconFilter />}
            theme="solid"
            type="secondary"
            className="w-full"
            htmlType="submit"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </form>
  );
};
