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
export const UserFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchWord: '',
      page: 1,
      size: 10,
      companyId: '',
      status: '',
      dateType: 3,
      dateRanges: [],
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
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-3 gap-4">
          <Controller
            name="searchWord"
            control={control}
            render={({ field }) => (
              <Input
                size="large"
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="Tên nhân viên, Mã nhân viên, số điện thoại, email"
                {...field}
              />
            )}
          />
          <Controller
            name="companyId"
            control={control}
            render={({ field }) => <CompanySelect {...field} />}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Chọn trạng thái"
                size="large"
                optionList={listSortStatusBoolean}
                {...field}
              />
            )}
          />
          <Controller
            name="dateType"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Chọn ngày"
                size="large"
                optionList={dateRegisterUser}
                {...field}
              />
            )}
          />
          <Controller
            name="dateRanges"
            control={control}
            render={({ field }) => (
              <DatePicker
                size="large"
                className="w-full"
                type="dateRange"
                insetInput
                format="dd/MM/yyyy"
                {...field}
              />
            )}
          />
          {/* <div className='flex-grow'>
            <Controller name='role' control={control} render={({ field }) => <RolesSelect {...field} />} />
          </div> */}
          <Button
            icon={<IconFilter />}
            theme="solid"
            type="secondary"
            htmlType="submit"
          >
            Tìm kiếm
          </Button>
        </div>
      </form>
    </>
  );
};
