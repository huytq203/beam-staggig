import { InputWrapper } from '@components/shared';
import { COMMON_FORMAT, TIMEZONE_FORMAT } from '@constants/common-format';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
export const RankFilter = (props: any) => {
  const { onFilter, refetch } = props;

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchWord: '',
      monthValue: DateTimeHelper.getCurrentDate('fullDateObject', 1)?.month,
      yearValue: DateTimeHelper.getCurrentDate('fullDateObject', 1)?.year,
      page: 1,
      size: 10,
      dateRanges: moment().tz(TIMEZONE_FORMAT.GMT0).format(),
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      searchWord: '',
    });
  }, []);
  const onSubmitValues = (values: any) => {
    const monthRanges = DateTimeHelper.convertTimeZone(
      values.dateRanges,
      COMMON_FORMAT.MONTH_YEAR
    ).split('/');
    return onFilter({
      searchWord: values.searchWord.trim(),
      monthValue: monthRanges[0],
      yearValue: monthRanges[1],
      page: 1,
      size: 10,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-3 gap-4">
          <InputWrapper
            field="searchWord"
            label="Người giới thiệu"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="SĐT người giới thiệu"
                size="large"
                {...e}
              />
            )}
          />
          <InputWrapper
            field="dateRanges"
            label="Kỳ xét thưởng"
            control={control}
            errors={errors}
            component={(e: any) => (
              <DatePicker
                size="large"
                className="w-full"
                type="month"
                insetInput
                format="MM/yyyy"
                showClear={false}
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
