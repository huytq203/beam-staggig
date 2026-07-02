import { InputWrapper } from '@components/shared';
import { CustomMonthRangePicker } from '@components/shared/CustomMonthRangePicker';
import { CompanySelect } from '@components/widgets';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconFilter } from '@douyinfe/semi-icons';
import { Button, DatePicker, Select } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ExportReportOperationsButton } from './ExportReportOperations';

export const ReportOperationsFilter = (props: any) => {
  const { onSubmit, refetch } = props;
  const [exportDate, setExportDate] = useState({});
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'OVERVIEW',
      companyIds: '',
      dateRanges: ['', ''],
      isMonth: 0,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
    });
  }, []);

  useEffect(() => {
    const endTime = moment(watch('dateRanges')[1]).format().split('T');
    const startTime = moment(watch('dateRanges')[0]).format().split('T');
    setExportDate({
      endTime: watch('dateRanges')[1] ? endTime[0] : '',
      startTime: watch('dateRanges')[0] ? startTime[0] : '',
      companyIds: watch('companyIds'),
      isMonth: watch('isMonth'),
      type: watch('type'),
    });
  }, [
    watch('dateRanges'),
    watch('companyIds'),
    watch('type'),
    watch('isMonth'),
  ]);

  useEffect(() => {
    setValue('dateRanges', ['', '']);
  }, [watch('isMonth')]);

  const onSubmitValues = (values: any) => {
    onSubmit &&
      onSubmit({
        type: values.type,
        endTime: values.dateRanges[1]
          ? DateTimeHelper.convertTimeZone(
              values.dateRanges[1],
              COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
            )
          : '',
        startTime: values.dateRanges[0]
          ? DateTimeHelper.convertTimeZone(
              values.dateRanges[0],
              COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
            )
          : '',
        companyIds: watch('companyIds') ? values.companyIds : '',
        isMonth: values.isMonth,
      });
    refetch();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  optionList={[
                    {
                      label: 'Báo cáo tổng quát',
                      value: 'OVERVIEW',
                    },
                    {
                      label: 'Báo cáo doanh nghiệp',
                      value: 'COMPANY',
                    },
                  ]}
                  size="large"
                  showClear={false}
                  {...field}
                />
              )}
            />

            <Controller
              name="isMonth"
              control={control}
              render={({ field }) => (
                <Select
                  size="large"
                  optionList={[
                    {
                      label: 'Báo cáo theo tháng',
                      value: 0,
                    },
                    {
                      label: 'Báo cáo theo khoảng thời gian',
                      value: 1,
                    },
                  ]}
                  {...field}
                />
              )}
            />

            <InputWrapper
              field="companyIds"
              control={control}
              errors={errors}
              component={(customProps: any) => (
                <CompanySelect {...customProps} multiple={true} />
              )}
            />

            {watch('isMonth') == 0 ? (
              <Controller
                name="dateRanges"
                control={control}
                render={({ field }) => (
                  <CustomMonthRangePicker
                    className="w-full"
                    type="month"
                    placeholder="Tháng"
                    format={
                      DateTimeHelper.checkMonthRange(watch('isMonth')).format
                    }
                    {...field}
                  />
                )}
              />
            ) : (
              <Controller
                name="dateRanges"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    type="dateRange"
                    className="w-full"
                    format="dd/MM/yyyy"
                    disabledDate={(current: any) => {
                      return DateTimeHelper.disabledFutureDatePicker(
                        current,
                        0,
                        'days'
                      );
                    }}
                    {...field}
                  />
                )}
              />
            )}

            <div className="grid grid-cols-2 items-center gap-4">
              <Button
                icon={<IconFilter />}
                theme="solid"
                type="secondary"
                htmlType="submit"
              >
                Tìm kiếm
              </Button>
              <ProtectedWrapper
                allowedRoles={[
                  UserRole.BEAM_ADMIN,
                  UserRole.SUPER_ADMIN,
                  UserRole.SALE,
                  UserRole.CONTROLLER,
                  UserRole.RECONCILER,
                ]}
              >
                <ExportReportOperationsButton filter={exportDate} />
              </ProtectedWrapper>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4"></div>
        </div>
      </form>
    </>
  );
};
