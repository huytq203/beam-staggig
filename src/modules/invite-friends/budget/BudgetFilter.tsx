import { InputWrapper } from '@components/shared';
import { CompanySelect } from '@components/widgets';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
export const BudgetFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dateRanges: '',
    },
  });

  const onSubmitValues = (values: any) => {
    refetch();
    return onFilter({
      dateRanges: values.dateRanges,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-3 gap-4">
          <InputWrapper
            field="dateRanges"
            label="Ngày cập nhật"
            control={control}
            errors={errors}
            component={(e: any) => (
              <DatePicker
                size="large"
                className="w-full"
                type="date"
                insetInput
                format="dd/MM/yyyy"
                {...e}
              />
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
