import { IconFilter } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  NotificationSubTypeSelect,
  NotificationTypeSelect,
} from '@components/widgets';
import { InputWrapper } from '@components/shared';

export const NotificationListFilter = (props: any) => {
  const { onFilter, refetch } = props;

  const {
    control,
    reset,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // searchKey: '',
      type: 'TICKET',
      subType: '',
      page: 1,
      currentPage: 1,
      size: 10,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      // searchKey: '',
    });
  }, []);

  const onSubmitValues = (values: any) => {
    onFilter &&
      onFilter({
        ...values,
        // searchKey: values.searchKey.trim(),
        type: values.type,
        subType: values.subType ?? '',
      });
    refetch();
  };
  return (
    <div className="">
      <form
        // onKeyDown={(e) => {
        //   e.key === 'Enter' && e.preventDefault();
        // }}
        onSubmit={handleSubmit(onSubmitValues)}
      >
        <div className="grid grid-cols-[25%_50%_25%] gap-5">
          <InputWrapper
            field="type"
            // label="Nhóm thông báo"
            control={control}
            errors={errors}
            component={(props: any) => (
              <NotificationTypeSelect
                size="large"
                {...props}
                onChange={(e: any) => {
                  props.onChange(e);
                  setValue('subType', '');
                }}
              />
            )}
          />
          <InputWrapper
            field="subType"
            // label="Loại thông báo"
            control={control}
            errors={errors}
            component={(e: any) => (
              <NotificationSubTypeSelect
                type={watch('type')}
                size="large"
                {...e}
              />
            )}
          />

          <Button
            icon={<IconFilter />}
            theme="solid"
            // onClick={() => onSubmitValues(getValues())}
            htmlType="submit"
            type="secondary"
            className="w-full"
          >
            Tìm kiếm
          </Button>
        </div>
      </form>
    </div>
  );
};
