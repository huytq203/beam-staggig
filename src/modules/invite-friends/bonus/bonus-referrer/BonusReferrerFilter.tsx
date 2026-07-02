import { InputWrapper } from '@components/shared';
import { CompanySelect } from '@components/widgets';
import { TIMEZONE_FORMAT } from '@constants/common-format';
import { IconFilter, IconSearch, IconPlus } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ExportBonusReferrerButton } from './ExportBonusReferrer';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';

interface exportData {
  phoneNumber: string;
  status: string;
  dateType: string;
  endTime: string;
  startTime: string;
}

export const BonusReferrerFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const [exportData, setExportData] = useState<exportData>({
    phoneNumber: '',
    // companyIds: '',
    status: 'ALL',
    dateType: 'ALL',
    endTime: '',
    startTime: '',
  });
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: '',
      // companyIds: '',
      status: 'ALL',
      dateType: 'ALL',
      dateRanges: ['', ''],
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
  useEffect(() => {
    setExportData({
      endTime: watch('dateRanges')[1]
        ? DateTimeHelper.fomartDateRangeSubmit(
            DateTimeHelper.setEndTime(
              watch('dateRanges')[1],
              TIMEZONE_FORMAT.GMT7
            )
          )
        : '',
      startTime: DateTimeHelper.fomartDateRangeSubmit(watch('dateRanges')[0]),
      phoneNumber: watch('phoneNumber').trim(),
      status: watch('status'),
      dateType: watch('dateType'),
    });
  }, [
    watch('dateRanges'),
    watch('phoneNumber'),
    watch('dateType'),
    watch('status'),
  ]);
  const onSubmitValues = (values: any) => {
    refetch();
    return onFilter({
      phoneNumber: values.phoneNumber.trim(),
      // companyIds: values.companyIds,
      endTime: values.dateRanges[1]
        ? DateTimeHelper.fomartDateRangeSubmit(
            DateTimeHelper.setEndTime(
              values.dateRanges[1],
              TIMEZONE_FORMAT.GMT7
            )
          )
        : '',
      startTime: DateTimeHelper.fomartDateRangeSubmit(values.dateRanges[0]),
      status: values.status,
      dateType: values.dateType,
      page: 1,
      size: 10,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            field="phoneNumber"
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
          {/* <InputWrapper
            field="companyIds"
            label="Doanh nghiệp người giới thiệu"
            control={control}
            errors={errors}
            component={(e: any) => (
              <CompanySelect {...e} multiple={true} filter={true} />
            )}
          /> */}
          <InputWrapper
            field="status"
            label="Trạng thái"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select
                placeholder="Trạng thái"
                optionList={[
                  {
                    value: 'ALL',
                    label: 'Tất cả',
                  },
                  {
                    value: 'SUCCESS',
                    label: 'Đã trả thưởng',
                  },
                  {
                    value: 'PENDING',
                    label: 'Chờ trả thưởng',
                  },
                  {
                    value: 'PROCESSING',
                    label: 'Đang trả thưởng',
                  },
                ]}
                size="large"
                showClear={false}
                // style={{ width: 370 }}
                {...e}
              />
            )}
          />
          <InputWrapper
            field="dateType"
            label="Xem theo ngày"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select
                placeholder="Xem theo ngày"
                optionList={[
                  {
                    value: 'ALL',
                    label: 'Tất cả',
                  },
                  {
                    value: 'PROCESS_REWARD_DATE',
                    label: 'Ngày chi thưởng',
                  },
                  {
                    value: 'UPDATED_DATE',
                    label: 'Ngày cập nhật',
                  },
                ]}
                size="large"
                showClear={false}
                // style={{ width: 370 }}
                {...e}
              />
            )}
          />
          <InputWrapper
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
          <ProtectedWrapper
            allowedRoles={[
              UserRole.SUPER_ADMIN,
              UserRole.BEAM_ADMIN,
              UserRole.CONTROLLER,
            ]}
          >
            <ExportBonusReferrerButton data={exportData} />
          </ProtectedWrapper>
        </div>
      </form>
    </>
  );
};
