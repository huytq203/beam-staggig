import { InputWrapper } from '@components/shared';
import { COMMON_FORMAT, TIMEZONE_FORMAT } from '@constants/common-format';
import { IconFilter, IconUpload } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
export const BonusMonthFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      month: DateTimeHelper.getCurrentDate('fullDateObject', 1)?.month,
      year: DateTimeHelper.getCurrentDate('fullDateObject', 1)?.year,
      page: 1,
      size: 10,
      dateRanges: moment().tz(TIMEZONE_FORMAT.GMT0).format(),
    },
  });
  const onSubmitValues = (values: any) => {
    const monthRanges = DateTimeHelper.convertTimeZone(
      values.dateRanges,
      COMMON_FORMAT.MONTH_YEAR
    ).split('/');
    refetch();
    return onFilter({
      month: monthRanges[0],
      year: monthRanges[1],
      page: 1,
      size: 10,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-3 gap-4">
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
          {/* <ProtectedWrapper
            allowedRoles={[
              UserRole.CONTROLLER,
              UserRole.SUPER_ADMIN,
              UserRole.BEAM_ADMIN,
            ]}
          >
            <Button
              theme="solid"
              // type="tertiary"
              onClick={() =>
                router.push('/invite-friends/bonus/bonus-month/import')
              }
              icon={<IconUpload />}
              // className="bg-[#5dbea3]"
              className="mt-7"
            >
              Tải lên mốc thưởng
            </Button>
          </ProtectedWrapper> */}
        </div>
      </form>
    </>
  );
};
