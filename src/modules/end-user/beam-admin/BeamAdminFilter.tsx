import { RolesSelect } from '@components/widgets/Select/RolesSelect';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { accountLockedFilterOptions } from '../constants';
export const BeamAdminFilter = (props: any) => {
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
      role: '',
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
      role: values.role ? values.role : '',
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(20rem,2fr)_minmax(13rem,1fr)_minmax(13rem,1fr)_auto] xl:items-end">
        <div className="min-w-0 space-y-2 md:col-span-2 xl:col-span-1">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="beam-admin-search"
          >
            Tìm kiếm
          </label>
          <Controller
            name="searchWord"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="beam-admin-search"
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
            className="block text-sm font-medium text-gray-700"
            htmlFor="beam-admin-account-locked"
          >
            Trạng thái khóa
          </label>
          <Controller
            name="accountLocked"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="beam-admin-account-locked"
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
            className="block text-sm font-medium text-gray-700"
            htmlFor="beam-admin-role"
          >
            Quyền tài khoản
          </label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <RolesSelect {...field} id="beam-admin-role" showClear />
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
