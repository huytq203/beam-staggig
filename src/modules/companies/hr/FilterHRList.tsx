import { listSortStatus } from '@constants/select-options.constants';
import { IconFilter, IconSearch, IconPlus } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
export const FilterHRList = (props: any) => {
  const { onFilter, afterSubmit, companyId, refetch } = props;
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
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      searchWord: '',
    });
  }, []);
  const onSubmitValues = (values: any) => {
    // if (values.status === 5) {
    //   delete values.status
    //   return onFilter({
    //     ...values,
    //     name: values.name.trim(),
    //   })
    // }
    // refetch();
    return onFilter({
      searchWord: values.searchWord.trim(),
      page: 1,
      size: 10,
      companyId: companyId,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="flex gap-4 items-center">
          <div className="w-1/2">
            <Controller
              name="searchWord"
              control={control}
              render={({ field }) => (
                <Input
                  size="large"
                  prefix={<IconSearch />}
                  showClear
                  autoComplete="off"
                  placeholder="Tên nhân viên, Mã nhân viên, số điện thoại"
                  {...field}
                />
              )}
            />
          </div>
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
