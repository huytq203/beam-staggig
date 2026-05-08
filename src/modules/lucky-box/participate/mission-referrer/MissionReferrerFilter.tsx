import { InputWrapper } from '@components/shared';
import { CustomMonthRangePicker } from '@components/shared/CustomMonthRangePicker';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ExportMissionReferrer } from './ExportMissionReferrer';
export const MissionReferrerFilter = (props: any) => {
  const { onFilter, refetch } = props;
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
      phoneNumber: '',
    });
  }, []);
  const onSubmitValues = (values: any) => {
    refetch();
    return onFilter({
      phoneNumber: values.phoneNumber.trim(),
      page: 1,
      size: 10,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-3 gap-4">
          <InputWrapper
            field="phoneNumber"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="Số điện thoại"
                size="large"
                {...e}
              />
            )}
          />

          <Button
            icon={<IconFilter />}
            theme="solid"
            type="secondary"
            htmlType="submit"
          >
            Tìm kiếm
          </Button>
          <ExportMissionReferrer filterExport={getValues()} />
        </div>
      </form>
    </>
  );
};
