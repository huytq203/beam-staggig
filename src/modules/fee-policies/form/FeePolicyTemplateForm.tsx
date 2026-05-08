import { InputWrapper } from '@components/shared/InputWrapper';
import { FormActionButton } from '@components/widgets';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import { Input, Notification, Select, Spin, TextArea } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { FeePolicyTemplateService } from '@services/fee-policy-templates';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateCompanyFeePolicySchema } from 'validations/fee/CompanyFeePolicy';
import {
  feePolicyStatusOptions,
  feePolicyStatusOptionsWithDraf,
  feePolicyTypeOptions,
} from '../constants';
import { getRangeList } from '../helper';
import { FPMainSetting } from './settings/FPMainSetting';

export const FeePolicyTemplateForm = (props: any) => {
  const { onCancel, onSave, company = false, isNew, feePolicyId, data } = props;
  const { authCheckByRole, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateCompanyFeePolicySchema),
    defaultValues: {
      ...data,
      feeType: data?.feeType ?? 0,
      status: data?.status ?? 0,
      applyUpperFeeLimit: data?.applyUpperFeeLimit ?? false,
      applyLowerFeeLimit: data?.applyLowerFeeLimit ?? false,
      finalLimit: data?.finalLimit ?? false,
      feeSharingType: data?.feeSharingType ?? 0,
      feeRangeType: data?.feeRangeType ?? [0],
      feeSharingValue: data?.feeSharingValue ?? 0,
      feeValue: data?.feeValue ?? [0],
    },
  });
  // useEffect(() => {
  //   const sharingRate = watch('feeSharingType');
  //   const old = getValues();
  //   let feeSharingValue = watch('feeSharingValue');

  //   if (sharingRate == 1) {
  //     feeSharingValue = 0;
  //   }
  //   reset({
  //     ...old,
  //     feeSharingValue: feeSharingValue,
  //     feeSharingType: watch('feeSharingType'),
  //   });
  // }, [watch('feeSharingType')]);

  useEffect(() => {
    const oldValues = getValues();
    reset({
      ...oldValues,
      rangeList: getRangeList(data),
      feeRange: [0],
      feeRangeType: watch('feeRangeType'),
      feeValue: watch('feeValue'),
      // feeSharingType: watch('feeSharingType'),
      feeSharingValue: watch('feeSharingValue'),
      feeType: watch('feeType'),
    });
  }, [watch('feeType')]);

  useEffect(() => {
    if (watch('feeType') == 0 && watch('feeRangeType.0') == 0) {
      setValue('applyUpperFeeLimit', false);
      setValue('applyLowerFeeLimit', false);
    }
  }, [watch('feeRangeType.0')]);

  // useEffect(() => {
  //   const feeType = watch("feeType");
  //   const feeRangeType = watch("feeRangeType");
  //   const feeRangeValue = watch("feeValue");
  //   let newFeeRangeValue = [...feeRangeValue];
  //   if (feeRangeType.length > 0 && feeType == 0) {
  //     if (feeRangeValue[0] > 100) {
  //       newFeeRangeValue[0] = 0;
  //       setValue("feeValue", newFeeRangeValue);
  //     }
  //   }
  // }, [watch("feeRangeType.0")]);

  const onSubmit = (values: any) => {
    let request = values;
    if (getValues('feeType') == 1) {
      const rangeList = values['rangeList'];

      const formFeeRangeType = rangeList.map((x: any) => x.feeType);
      const formFeeRange = rangeList.map((x: any) => x.from);
      const formFeeValue = rangeList.map((x: any) => x.fee);
      let requestFeeRange = [...formFeeRange];

      request = {
        ...values,
        feeValue: formFeeValue,
        feeRange: requestFeeRange,
        feeRangeType: formFeeRangeType,
      };
    }
    delete request.rangeList;
    setLoading(true);
    FeePolicyTemplateService.saveOrUpdateFeePolicy(request).then((x: any) => {
      if (x) {
        Notification.success({
          content: `${isNew ? 'Tạo mới' : 'Cập nhật'} biểu mẫu thành công!`,
          theme: 'light',
        });
        onCancel && onCancel();
      } else {
        Notification.error({
          content: `${isNew ? 'Tạo mới' : 'Cập nhật'} biểu mẫu thất bại!`,
          theme: 'light',
        });
        setLoading(false);
      }
    });
  };
  return (
    <Spin spinning={loading} size="large">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 p-4">
          <span className="font-bold">THÔNG TIN CHÍNH SÁCH PHÍ</span>

          <>
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper
                required
                field="name"
                label="Tên chính sách phí"
                component={(props: any) => (
                  <Input showClear maxLength={200} {...props} />
                )}
                errors={errors}
                control={control}
              />
              <InputWrapper
                required
                field="feeType"
                label="Loại Chính sách phí"
                component={(props: any) => {
                  return (
                    <Select
                      optionList={feePolicyTypeOptions}
                      {...props}
                      disabled={!isNew}
                    />
                  );
                }}
                errors={errors}
                control={control}
              />
            </div>
          </>

          <FPMainSetting
            control={control}
            errors={errors}
            watch={watch}
            getValues={getValues}
            setValue={setValue}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputWrapper
              required
              field="status"
              label="Trạng thái"
              component={(props: any) => (
                <Select
                  optionList={
                    isNew || (!isNew && getValues('status') === 2)
                      ? feePolicyStatusOptionsWithDraf
                      : feePolicyStatusOptions
                  }
                  showClear={false}
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
          </div>

          {!company && (
            <>
              <div className="grid grid-cols-1 gap-4">
                <InputWrapper
                  field="description"
                  label="Mô tả"
                  component={(props: any) => <TextArea showClear {...props} />}
                  errors={errors}
                  control={control}
                />
              </div>
            </>
          )}

          <FormActionButton onCancel={onCancel} loading={loading} />
        </div>
      </form>
    </Spin>
  );
};
