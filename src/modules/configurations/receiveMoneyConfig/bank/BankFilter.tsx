import { listSortStatus } from '@constants/select-options.constants';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import { CreateTranferFeeForm } from '@modules/configurations/form/CreateTranferFeeForm';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const BankFilter = (props: any) => {
  const { onFilter } = props;
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
    // if (values.status === 3) {
    //   delete values.status;
    //   return onFilter({
    //     ...values,
    //   });
    // }
    // return onFilter({
    //   ...values,
    // });
  };
  return (
    <>
      <form key={1} onSubmit={handleSubmit(onSubmitValues)} name='filter'>
        <div className='flex items-center gap-4 my-4'>
          <div className='flex-1 flex items-center'>
            <div className='flex-1 flex gap-1'>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input prefix={<IconSearch />} showClear autoComplete='off' placeholder='Tìm kiếm' {...field} />
                )}
              />
            </div>
            <div className='px-3'>
              <Controller
                name='status'
                control={control}
                render={({ field }) => <Select optionList={listSortStatus} {...field} />}
              />
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <Button
              icon={<IconFilter />}
              theme='solid'
              type='secondary'
              className='w-full'
              htmlType='submit'
              name='filter'
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
