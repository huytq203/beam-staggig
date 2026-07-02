import { InputWrapper } from '@components/shared';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ExportMissionSalaryAdvanceButton } from './ExportMissionSalaryAdvance';
export const MissionSalaryAdvanceFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchKeyword: '',
      month: '',
      page: 1,
      size: 10,
    },
  });
  const getMonth = () => {
    let today = new Date();
    let MM = String(today.getMonth() + 1).padStart(1, '0'); //January is 0!

    if (Number(MM) >= 3 && Number(MM) <= 5) {
      return MM;
    }
    return '0';
  };

  useEffect(() => {
    reset({
      ...getValues(),
      searchKeyword: '',
      month: getMonth(),
    });
  }, []);
  const onSubmitValues = (values: any) => {
    onFilter({
      searchKeyword: values.searchKeyword.trim(),
      month: values.month,
      page: 1,
      size: 10,
    });
    refetch();
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            field="searchKeyword"
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
          <InputWrapper
            field="month"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select
                placeholder="Lựa chọn thời gian"
                size="large"
                optionList={[
                  { label: '04/2025', value: '4' },
                  { label: '05/2025', value: '5' },
                  { label: '06/2025', value: '6' },
                ]}
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
          <ExportMissionSalaryAdvanceButton filterExport={getValues()} />
        </div>
      </form>
    </>
  );
};
