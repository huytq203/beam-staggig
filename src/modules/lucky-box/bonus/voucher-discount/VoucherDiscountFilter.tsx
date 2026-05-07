import { InputWrapper } from '@components/shared';
import { listRewardStatus } from '@constants/select-options.constants';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ExportVoucherDiscountListButton } from './ExportVoucherDiscount';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { TIMEZONE_FORMAT } from '@constants/common-format';

export const VoucherDiscountFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const [filterExport, setFilterExport] = useState({});
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
      type: 'DISCOUNT_CARD',
      rewardStatus: '',
      page: 1,
      size: 10,
      dateRanges: [''],
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      searchWord: '',
      type: 'DISCOUNT_CARD',
      rewardStatus: '',
    });
  }, []);

  const onSubmitValues = (values: any) => {
    refetch();
    return onFilter({
      searchWord: values.searchWord.trim(),
      type: 'DISCOUNT_CARD',
      rewardStatus: '',
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
        <div className="grid grid-cols-3 gap-4">
          <InputWrapper
            field="searchWord"
            label="Số điện thoại"
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
          {/* <InputWrapper
            field="rewardStatus"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select {...e} size="large" optionList={listRewardStatus} />
            )}
          /> */}
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
            <ExportVoucherDiscountListButton filterExport={filterExport} />
          </div>
        </div>
      </form>
    </>
  );
};
