import { InputWrapper } from '@components/shared';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MissionCheckinDetailSchema } from 'validations/lucky-box/luckyBox.schema';
export const MissionCheckinDetailFilter = (props: any) => {
  const { onFilter, filter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(MissionCheckinDetailSchema),
    defaultValues: {
      dateRanges: [],
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
      startTime: DateTimeHelper.convertTimeZone(
        values.dateRanges[0],
        COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
      ),
      endTime: DateTimeHelper.convertTimeZone(
        values.dateRanges[1],
        COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
      ),
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
            field="dateRanges"
            label="Lựa chọn thời gian"
            control={control}
            errors={errors}
            component={(e: any) => (
              <DatePicker
                size="large"
                className="w-full"
                type="dateRange"
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
