import { CompanySelect } from '@components/widgets';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { accountLockedFilterOptions } from '../constants';
export const HRAdminFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      searchWord: '',
      companyIds: '',
      page: 1,
      size: 10,
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
    refetch();
    return onFilter({
      searchWord: values.searchWord.trim(),
      companyIds: values.companyIds,
      ...(values.accountLocked === ''
        ? {}
        : { accountLocked: values.accountLocked === 'true' }),
      page: 1,
      size: 10,
    });
  };
  return (
    <form
      className="rounded-lg bg-gray-50 p-4"
      onSubmit={handleSubmit(onSubmitValues)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(20rem,2fr)_minmax(13rem,1fr)_minmax(16rem,1.35fr)_auto] xl:items-end">
        <div className="min-w-0 space-y-2 md:col-span-2 xl:col-span-1">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="hr-admin-search"
          >
            Tìm kiếm
          </label>
          <Controller
            name="searchWord"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="hr-admin-search"
                className="w-full"
                size="large"
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="Tên, mã nhân viên hoặc số điện thoại"
              />
            )}
          />
        </div>

        <div className="min-w-0 space-y-2">
          <label
            id="hr-admin-account-locked-label"
            className="block text-sm font-medium text-gray-700"
            htmlFor="hr-admin-account-locked"
          >
            Trạng thái khóa
          </label>
          <Controller
            name="accountLocked"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="hr-admin-account-locked"
                aria-labelledby="hr-admin-account-locked-label"
                className="w-full"
                size="large"
                showClear
                optionList={accountLockedFilterOptions}
              />
            )}
          />
        </div>

        <div className="min-w-0 space-y-2">
          <label
            id="hr-admin-company-ids-label"
            className="block text-sm font-medium text-gray-700"
            htmlFor="hr-admin-company-ids"
          >
            Doanh nghiệp quản lý
          </label>
          <Controller
            name="companyIds"
            control={control}
            render={({ field }) => (
              <CompanySelect
                {...field}
                id="hr-admin-company-ids"
                aria-labelledby="hr-admin-company-ids-label"
                className="w-full"
                size="large"
                multiple
                filter
                showClear
                maxTagCount={1}
                placeholder="Chọn doanh nghiệp, mã DN hoặc MST"
              />
            )}
          />
        </div>

        <div className="flex md:col-span-2 md:justify-end xl:col-span-1">
          <Button
            icon={<IconFilter />}
            theme="solid"
            type="secondary"
            className="w-full md:w-auto xl:min-w-[7.5rem]"
            htmlType="submit"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </form>
  );
};
