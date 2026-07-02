import { RolesSelect } from '@components/widgets/Select/RolesSelect';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
export const BeamAdminFilter = (props: any) => {
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
      role: '',
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
      role: values.role ? values.role : '',
      page: 1,
      size: 10,
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
          <div className="flex-grow">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RolesSelect {...field} showClear={true} />
              )}
            />
          </div>
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
