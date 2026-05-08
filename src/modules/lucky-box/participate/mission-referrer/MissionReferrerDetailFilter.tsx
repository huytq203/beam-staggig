import { InputWrapper } from '@components/shared';
import { IconFilter } from '@douyinfe/semi-icons';
import { Button, Input } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const MissinReferrerDetailFilter = (props: any) => {
  const { onFilter, filter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: '',
      page: 1,
      size: 10,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
    });
  }, []);
  const onSubmitValues = (values: any) => {
    refetch();
    return onFilter({
      phoneNumber: filter?.phoneNumber,
      page: 1,
      size: 10,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            // required
            field="phoneNumber"
            label="SĐT"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input size="large" className="w-full" {...e} />
            )}
          />
          <Button
            icon={<IconFilter />}
            theme="solid"
            type="secondary"
            htmlType="submit"
            className="mt-7"
          >
            Tìm kiếm
          </Button>
        </div>
      </form>
    </>
  );
};
