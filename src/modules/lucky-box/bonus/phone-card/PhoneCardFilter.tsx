import { InputWrapper } from '@components/shared';
import { IconFilter, IconSearch, IconPlus } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ExportPhoneCardListButton } from './ExportPhoneCard';
import { useRouter } from 'next/router';
import { listRewardStatus } from '@constants/select-options.constants';
import { TIMEZONE_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
export const PhoneCardFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const [filterExport, setFilterExport] = useState({});
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
      searchWord: '',
      type: 'PHONE_CARD',
      rewardStatus: '',
      dateRanges: [''],
      page: 1,
      size: 10,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      searchWord: '',
      type: 'PHONE_CARD',
      rewardStatus: '',
    });
  }, []);
  const onSubmitValues = (values: any) => {
    refetch();
    return onFilter({
      searchWord: values.searchWord.trim(),
      type: 'PHONE_CARD',
      rewardStatus: values.rewardStatus,
      rewardEndTime: values.dateRanges[1]
        ? DateTimeHelper.fomartDateRangeSubmit(
            DateTimeHelper.setEndTime(
              values.dateRanges[1],
              TIMEZONE_FORMAT.GMT7
            ).format()
          )
        : '',
      rewardStartTime: values.dateRanges[0]
        ? DateTimeHelper.fomartDateRangeSubmit(
            DateTimeHelper.setStartTime(
              values.dateRanges[0],
              TIMEZONE_FORMAT.GMT7
            ).format()
          )
        : '',
      page: 1,
      size: 10,
    });
  };

  useEffect(() => {
    setFilterExport({
      ...getValues(),
      rewardEndTime: getValues().dateRanges[1]
        ? DateTimeHelper.fomartDateRangeSubmit(
            DateTimeHelper.setEndTime(
              getValues().dateRanges[1],
              TIMEZONE_FORMAT.GMT7
            ).format()
          )
        : '',
      rewardStartTime: getValues().dateRanges[0]
        ? DateTimeHelper.fomartDateRangeSubmit(
            DateTimeHelper.setStartTime(
              getValues().dateRanges[0],
              TIMEZONE_FORMAT.GMT7
            ).format()
          )
        : '',
    });
    return () => {};
  }, [watch('dateRanges'), watch('rewardStatus'), watch('searchWord')]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            field="searchWord"
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
            field="rewardStatus"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select {...e} size="large" optionList={listRewardStatus} />
            )}
          />
          <InputWrapper
            field="dateRanges"
            label="Lựa chọn thời gian ngày nhận quà"
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

          <div className="flex justify-around mt-7">
            <Button
              icon={<IconFilter />}
              theme="solid"
              type="secondary"
              htmlType="submit"
            >
              Tìm kiếm
            </Button>
            <ExportPhoneCardListButton filterExport={filterExport} />
            <Button
              theme="solid"
              type="tertiary"
              style={{
                textDecoration: 'none',
                width: '250px',
                marginLeft: '20px',
              }}
              onClick={() => router.push('/lucky-box/bonus/phone-card/import')}
              icon={<IconPlus />}
            >
              Tải lên danh sách thưởng
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
