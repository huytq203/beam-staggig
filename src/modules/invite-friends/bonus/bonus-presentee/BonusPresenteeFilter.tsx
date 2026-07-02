import { InputWrapper } from '@components/shared';
import { IconFilter, IconSearch, IconUpload } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { TIMEZONE_FORMAT } from '@constants/common-format';
import { ExportBonusInvitedButton } from './ExportBonusInvited';

interface exportData {
  phoneNumber: string;
  status: string;
  dateType: string;
  endTime: string;
  startTime: string;
}

export const BonusPresenteeFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const [exportData, setExportData] = useState<exportData>({
    phoneNumber: '',
    // companyIds: '',
    status: 'ALL',
    dateType: 'ALL',
    endTime: '',
    startTime: '',
  });
  const router = useRouter();
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
            label="Người được giới thiệu"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="SĐT người được giới thiệu"
                size="large"
                {...e}
              />
            )}
          />
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
                    value: 'EARNED',
                    label: 'Đã chi thưởng',
                  },
                  {
                    value: 'PENDING',
                    label: 'Chưa chi thưởng',
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
                    value: 'CREATED_DATE',
                    label: 'Ngày khảo sát',
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
              UserRole.CONTROLLER,
              UserRole.SUPER_ADMIN,
              UserRole.BEAM_ADMIN,
            ]}
          >
            <div>
              <Button
                theme="solid"
                // type="tertiary"
                onClick={() =>
                  router.push('/invite-friends/bonus/bonus-presentee/import')
                }
                icon={<IconUpload />}
                // className="bg-[#5dbea3]"
                className="mt-7 w-[250px] mr-2"
              >
                Tải lên mốc thưởng
              </Button>
              <ExportBonusInvitedButton data={exportData} />
            </div>
          </ProtectedWrapper>
        </div>
      </form>
    </>
  );
};
