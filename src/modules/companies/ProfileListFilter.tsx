import {
  listSortStatus,
  listSortType,
} from '@constants/select-options.constants';
import { IconFilter } from '@douyinfe/semi-icons';
import { Button, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const ProfileListFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      page: 1,
      size: 10,
      sort: 'desc',
      status: 3,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      name: '',
    });
  }, []);
  const onSubmitValues = (values: any) => {
    if (values.status === 3) {
      delete values.status;
      refetch();
      return onFilter({
        ...values,
        sort: [`createdAt,${values.sort}`],
      });
    }
    refetch();
    return onFilter({
      ...values,
      sort: [`createdAt,${values.sort}`],
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="flex flex-col md:flex-row gap-4 md:justify-end py-2 md:items-center">
          <div className="grid grid-cols-2 md:flex  gap-4">
            <div className="px-3">
              <Controller
                name="sort"
                control={control}
                render={({ field }) => (
                  <Select
                    optionList={listSortType}
                    className="w-full"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="px-3">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    optionList={listSortStatus}
                    className="w-full"
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="px-3">
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
    </>
  );
};
