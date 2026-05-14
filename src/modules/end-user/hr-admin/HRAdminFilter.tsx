import { CompanySelect } from '@components/widgets';
import { IconFilter, IconSearch, IconPlus } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
export const HRAdminFilter = (props: any) => {
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
      companyIds: '',
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
    refetch();
    return onFilter({
      searchWord: values.searchWord.trim(),
      companyIds: values.companyIds,
      page: 1,
      size: 10,
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
                placeholder="Tên nhân viên, Mã nhân viên, số điện thoại"
                {...field}
              />
            )}
          />
          <Controller
            name="companyIds"
            control={control}
            render={({ field }) => (
              <CompanySelect {...field} multiple={true} filter={true} />
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
