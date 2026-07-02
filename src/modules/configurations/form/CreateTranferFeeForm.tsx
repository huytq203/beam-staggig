import {
  InputNumber,
  InputNumberByType,
  InputWrapper,
} from '@components/shared';
import { FormActionButton } from '@components/widgets';
import {
  Button,
  DatePicker,
  Input,
  Notification,
  Radio,
  RadioGroup,
  Select,
} from '@douyinfe/semi-ui';
import { ConfigurationService } from '@services/configuration';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useIsMount } from '@hooks/useIsMount';
import { CreateTransferFeeSchema } from 'validations/configurations';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
export const CreateTranferFeeForm = (props: any) => {
  const { transferFeeId, onCancel, isNew } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const { id } = router.query;
  const isFirstMount = useIsMount();
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['transfer_fee_detail', transferFeeId],
    () => ConfigurationService.getTransferFeeById(transferFeeId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const { authCheckByRole } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateTransferFeeSchema),
    defaultValues: {
      channel: 0,
      feeType: 0,
      coefficient: 0,
      fixedValue: 0,
      min: 14000,
      max: 950000,
      status: 0,
      name: '',
      startTime: new Date(),
      endTime: '',
    },
  });
  useEffect(() => {
    if (!isLoading && !isNew) {
      reset({
        ...data?.data,
        startTime: DateTimeHelper.convertTimeZone(
          data?.data?.startTime,
          COMMON_FORMAT.EMPTY_FORMAT
        ),
        endTime: DateTimeHelper.convertTimeZone(
          data?.data?.endTime,
          COMMON_FORMAT.EMPTY_FORMAT
        ),
      });
    }
  }, [isLoading, isFetching]);
  const onSubmitValuesTransfer = (values: any) => {
    const payload = {
      id: transferFeeId === 'create' ? null : transferFeeId,
      channel: values.channel,
      name: values.name,
      feeType: values.feeType,
      fixedValue: values.fixedValue,
      coefficient: values.coefficient,
      min: values.min,
      max: values.max,
      startTime: DateTimeHelper.fomartDateRangeSubmit(values.startTime),
      endTime: DateTimeHelper.fomartDateRangeSubmit(values.endTime),
      status: 0,
    };
    setLoading(true);
    ConfigurationService.saveOrUpdateTransfer(payload)
      .then((response: any) => {
        if (response) {
          Notification.success({
            title: 'Thành công',
            content: `${
              isNew ? 'Thêm mới' : 'Cập nhật'
            } phí chuyển tiền thành công!`,
            duration: 3,
            theme: 'light',
          });
          router.replace('/configurations/receive-money/transfer-fee');
        } else {
          // Notification.error({
          //   title: 'Thất bại',
          //   content: `${
          //     isNew ? 'Thêm mới' : 'Cập nhật'
          //   } phí chuyển tiền thất bại`,
          //   duration: 3,
          //   theme: 'light',
          // });
          setLoading(false);
        }
      })
      .catch((e) => {});
  };

  return (
    <div>
      <form key={2} onSubmit={handleSubmit(onSubmitValuesTransfer)}>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <InputWrapper
            required
            field="channel"
            label="Kênh chuyển tiền"
            component={(props: any) => (
              <Select
                disabled={!isNew && data?.data?.status === 0}
                optionList={feeChanel}
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
          <InputWrapper
            required
            field="name"
            label="Tên kênh chuyển tiền"
            component={(props: any) => (
              <Input
                disabled={!isNew && data?.data?.status === 0}
                maxLength={100}
                showClear
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
        </div>
        {watch('channel') == 2 && (
          <div>
            <InputWrapper
              field="feeType"
              component={(props: any) => (
                <RadioGroup
                  direction="horizontal"
                  {...props}
                  disabled={!isNew && data?.data?.status === 0}
                >
                  <Radio value={0}>Phí cố định</Radio>
                  <Radio value={1}>Phí biến đổi</Radio>
                </RadioGroup>
              )}
              errors={errors}
              control={control}
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 mt-3">
          <InputWrapper
            required
            field="fixedValue"
            label="Phí chuyển tiền"
            component={(props: any) => (
              <InputNumber
                disabled={
                  watch('feeType') == 1 || (!isNew && data?.data?.status === 0)
                }
                format="thousands"
                howClear
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
          {watch('feeType') == 1 && (
            <>
              <InputWrapper
                required
                field="coefficient"
                label="Hệ số thu phí"
                component={(props: any) => (
                  <InputNumberByType
                    disabled={!isNew && data?.data?.status === 0}
                    displayType={watch('feeType')}
                    maxLength={10}
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                field="min"
                label="Tối thiểu"
                component={(props: any) => (
                  <InputNumber
                    disabled={!isNew && data?.data?.status === 0}
                    format="thousands"
                    howClear
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                field="max"
                label="Tối đa"
                component={(props: any) => (
                  <InputNumber
                    min={watch('min')}
                    disabled={!isNew && data?.data?.status === 0}
                    format="thousands"
                    howClear
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <InputWrapper
            required
            field="startTime"
            label="Ngày bắt đầu"
            component={(props: any) => (
              <DatePicker
                showClear={false}
                disabled={!isNew && data?.data?.status == 0}
                type="dateTime"
                format="dd/MM/yyyy HH:mm:ss"
                {...props}
                disabledDate={(current: any) => {
                  return moment().add(-1, 'days') >= current;
                }}
              />
            )}
            errors={errors}
            control={control}
          />
          <InputWrapper
            field="endTime"
            label="Ngày kết thúc"
            component={(props: any) => (
              <DatePicker
                disabledDate={(current: any) => {
                  return watch('startTime') >= current;
                }}
                disabled={watch('status') == 1}
                type="dateTime"
                format="dd/MM/yyyy HH:mm:ss"
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
        </div>
        <FormActionButton onCancel={onCancel} loading={loading} />
      </form>
    </div>
  );
};

const feeChanel = [
  {
    value: 0,
    label: 'Nội bộ',
  },
  {
    value: 1,
    label: 'NAPAS',
  },
  {
    value: 2,
    label: 'CITAD',
  },
];
