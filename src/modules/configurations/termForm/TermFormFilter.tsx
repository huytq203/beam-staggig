import { listTermStatus } from '@constants/select-options.constants';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
export const TermFormFilter = (props: any) => {
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
      status: 'ALL',
    },
  });
  useEffect(() => {
    reset({
      ...getValues(),
      name: '',
    });
  }, []);
  const onSubmitValues = (values: any) => {
    return onFilter({
      ...values,
      name: values.name.trim(),
      
    });
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
                render={({ field }) => <Select optionList={listTermStatus} {...field} />}
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
