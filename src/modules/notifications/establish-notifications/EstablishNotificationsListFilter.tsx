import { InputWrapper } from '@components/shared';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import {
  listSortStatus,
  listTypeTimes,
  notificationEstablishType,
} from '@constants/select-options.constants';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { DateTimeHelper } from '@helpers/date-time.helper';
export const EstablishNotificationsListFilter = (props: any) => {
  const { onFilter, refetch } = props;

  const {
    control,
    reset,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // searchKey: '',
      type: '',
      subType: '',
      page: 1,
      currentPage: 1,
      size: 10,
      status: 3,
      typeTimes: '',
      title: '',
      dateRanges: [],
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      // searchKey: '',
    });
  }, []);

  const onSubmitValues = (values: any) => {
    onFilter &&
      onFilter({
        ...values,
        title: FunctionBase.checkTypeofVal(values.title, 'string')
          ? values.title.trim()
          : null,
        type: values.type ? values.type : '',
        endTime: DateTimeHelper.fomartDateRangeSubmit(
          DateTimeHelper.addDays(values.dateRanges[1], 1)
        ),
        startTime: DateTimeHelper.fomartDateRangeSubmit(values.dateRanges[0]),
      });
    refetch();
  };
  return (
    <div className="">
      <form
        // onKeyDown={(e) => {
        //   e.key === 'Enter' && e.preventDefault();
        // }}
        onSubmit={handleSubmit(onSubmitValues)}
      >
        <div className="grid grid-cols-3 gap-5">
          <InputWrapper
            field="title"
            label="Tiêu đề thông báo"
            control={control}
            errors={errors}
            component={(props: any) => (
              <Input
                size="large"
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="Tiêu đề thông báo"
                {...props}
              />
            )}
          />
          <InputWrapper
            field="type"
            label="Loại thông báo"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select
                optionList={notificationEstablishType}
                size="large"
                placeholder={'Loại thông báo'}
                // style={{ width: 320 }}
                showClear
                {...e}
              />
            )}
          />

          <InputWrapper
            field="status"
            label="Trạng thái"
            component={(props: any) => (
              <Select optionList={listSortStatus} size="large" {...props} />
            )}
            errors={errors}
            control={control}
          />
        </div>
        <div className="grid grid-cols-3 gap-5 mt-5 mb-5">
          <InputWrapper
            field="typeTimes"
            label="Xem theo ngày"
            component={(props: any) => (
              <Select optionList={listTypeTimes} size="large" {...props} />
            )}
            errors={errors}
            control={control}
          />
          <InputWrapper
            field="dateRanges"
            label="Lựa chọn thời gian"
            component={(props: any) => (
              <DatePicker
                size="large"
                className="w-full"
                type="dateRange"
                insetInput
                format="dd/MM/yyyy"
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />

          <div className="mt-7">
            <Button
              icon={<IconFilter />}
              theme="solid"
              // onClick={() => onSubmitValues(getValues())}
              htmlType="submit"
              type="secondary"
              className="w-full"
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
