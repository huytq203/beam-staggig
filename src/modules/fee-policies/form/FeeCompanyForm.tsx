import { InputWrapper } from '@components/shared/InputWrapper';
import { FormActionButton } from '@components/widgets';
import {
  DatePicker,
  Divider,
  Input,
  Notification,
  Select,
  Switch,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { yupResolver } from '@hookform/resolvers/yup';
import { FeePolicyService } from '@services/fee-policy';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import { CreateCompanyFeePolicySchema } from 'validations/fee/CompanyFeePolicy';
import { getRangeList, SelectFeePolicyTemplate } from '..';
import {
  feePolicyStatusOptions,
  feePolicyStatusOptionsWithDraf,
  feePolicyTypeOptions,
} from '../constants';
import { FPCompanyMainSetting } from './settings/FPCompanyMainSetting';
import { useRouter } from 'next/router';
import { CompanyFeePolicyService } from '@services/company-fee';
import { COMMON_FORMAT } from '@constants/common-format';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';

const initDefaultFeeOptions = {
  name: '',
  feePolicyTemplateId: '',
  feeRange: [],
  feeRangeType: [0],
  feeSharingType: 0,
  feeSharingValue: 0,
  feeType: feePolicyTypeOptions[0].value,
  feeValue: [0],
  upperFeeLimit: 0,
  lowerFeeLimit: 0,
  applyUpperFeeLimit: false,
  applyLowerFeeLimit: false,
  rangeList: [
    {
      uuid: uuidv4(),
      from: 0,
      type: 0,
      fee: 0,
      feeType: 0,
    },
    {
      uuid: uuidv4(),
      from: 1000000,
      type: 0,
      fee: 0,
      feeType: 0,
    },
  ],
  importedTemplate: null,
};

export const FeeCompanyForm = (props: any) => {
  const { feePolicyId, isNew = true, onCancel, onSave, setCheckData } = props;
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const router = useRouter();
  const companyId = router.query.companyId;
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateCompanyFeePolicySchema),
    defaultValues: {
      ...initDefaultFeeOptions,
      status: 0,
      description: '',
      noLimitUpper: true,
      // endTime: new Date(),
      startTime: new Date(),
      autoApply: false,
    },
  });

  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['fee_policy_detail', feePolicyId],
    () => FeePolicyService.getFeePolicy(feePolicyId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  useEffect(() => {
    if (!isLoading && !isNew) {
      const startTime = DateTimeHelper.convertTimeZone(
        data?.startTime,
        COMMON_FORMAT.LOCAL_DATE_TIME
      );
      const endTime = DateTimeHelper.convertTimeZone(
        data?.endTime,
        COMMON_FORMAT.LOCAL_DATE_TIME
      );
      const dateRange = [startTime, endTime];

      let resetData = data;
      if (data?.feeType == 1) {
        resetData = {
          ...resetData,
          startTime: DateTimeHelper.convertTimeZone(
            data?.startTime,
            COMMON_FORMAT.EMPTY_FORMAT
          ),
          endTime: DateTimeHelper.convertTimeZone(
            data?.endTime,
            COMMON_FORMAT.EMPTY_FORMAT
          ),
        };
      }

      resetData = {
        ...resetData,
        rangeList: getRangeList(data),
        // dateRange: dateRange,
        startTime: DateTimeHelper.convertTimeZone(
          data?.startTime,
          COMMON_FORMAT.EMPTY_FORMAT
        ),
        endTime: DateTimeHelper.convertTimeZone(
          data?.endTime,
          COMMON_FORMAT.EMPTY_FORMAT
        ),
      };

      reset(resetData);
    }
  }, [isLoading, isFetching]);
  const onSubmitForm = (values: any) => {
    let requestObject = { ...values };
    if (getValues('feeType') == 1) {
      const rangeList = values['rangeList'];
      const rangeSize = rangeList.length;

      const formFeeRangeType = rangeList.map((x: any) => x.feeType);
      const formFeeRange = rangeList.map((x: any) => x.from);
      const formFeeValue = rangeList.map((x: any) => x.fee);

      let requestFeeRange = [...formFeeRange];

      requestObject = {
        ...values,
        feeValue: formFeeValue,
        feeRange: requestFeeRange,
        feeRangeType: formFeeRangeType,
        finalLimit: true,
      };
    }

    requestObject = {
      ...requestObject,
      startTime: DateTimeHelper.fomartDateRangeSubmit(values.startTime),
      endTime: values.endTime
        ? DateTimeHelper.fomartDateRangeSubmit(values.endTime)
        : null,
    };
    delete requestObject.rangeList;
    if (companyId !== undefined) {
      setLoading(true);
      CompanyFeePolicyService.assignFPToOneCompany(
        requestObject,
        companyId
      ).then((x: any) => {
        if (x) {
          Notification.success({
            content: `Gán chính sách phí thành công!`,
            theme: 'light',
          });
          router.push(`/companies/${companyId}/fee-policies`);
        }
      });
    } else {
      setLoading(true);
      FeePolicyService.saveOrUpdateFeePolicy(requestObject).then((x: any) => {
        if (x) {
          Notification.success({
            content: `${
              isNew ? 'Tạo mới' : 'Cập nhật'
            } chính sách phí thành công!`,
            theme: 'light',
          });
          router.push({
            pathname: '/fee-policies/assign/assign',
            query: { id: x },
          });
        } else {
          Notification.error({
            content: `${
              isNew ? 'Tạo mới' : 'Cập nhật'
            } chính sách phí thất bại!`,
            theme: 'light',
          });
          setLoading(false);
        }
      });
    }
  };

  const checkFPTemplate = () => {
    if (getValues('feePolicyTemplateId') && isNew) {
      return true;
    } else if (!isNew) {
      return true;
    }
    return false;
  };

  const onCancelCompanyId = () => {
    router.push(`/companies/${companyId}/fee-policies`);
  };
  const onSelectTemplate = (selectedTemplate: any) => {
    const currentFormValues = getValues();
    reset({
      ...currentFormValues,
      feePolicyTemplateId: selectedTemplate.id,
      feeRange: selectedTemplate.feeRange,
      feeRangeType: selectedTemplate.feeRangeType,
      feeSharingType: selectedTemplate.feeSharingType,
      feeSharingValue: selectedTemplate.feeSharingValue,
      feeType: selectedTemplate.feeType,
      feeValue: selectedTemplate.feeValue,
      upperFeeLimit: selectedTemplate.upperFeeLimit,
      lowerFeeLimit: selectedTemplate.lowerFeeLimit,
      applyUpperFeeLimit: selectedTemplate.applyUpperFeeLimit,
      applyLowerFeeLimit: selectedTemplate.applyLowerFeeLimit,
      rangeList: getRangeList(selectedTemplate),
      importedTemplate: selectedTemplate,
    });
  };

  const onClearSelectTemplate = () => {
    const currentFormValues = getValues();
    reset({
      ...currentFormValues,
      ...initDefaultFeeOptions,
    });
  };
  const getUsedTemplate = () => {
    const currentValue: any = getValues();
    if (currentValue.importedTemplate || currentValue.feePolicyTemplateName)
      return (
        <>
          (Mẫu{' '}
          {currentValue.importedTemplate?.name
            ? currentValue.importedTemplate?.name
            : currentValue.feePolicyTemplateName}
          )
        </>
      );
    return '';
  };
  useEffect(() => {
    if (isNew) return;
    if (!data && !isLoading) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;

  return (
    <>
      <SpinWrapper spinning={loading} size="large">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="flex flex-col gap-4">
            <span className="font-bold">THÔNG TIN CHUNG</span>
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper
                required
                field="name"
                label="Tên chương trình phí"
                component={(props: any) => (
                  <Input showClear maxLength={200} {...props} />
                )}
                errors={errors}
                control={control}
              />
              <SelectFeePolicyTemplate
                errors={errors}
                control={control}
                templateType={watch('feeType')}
                onSelect={onSelectTemplate}
                onClear={onClearSelectTemplate}
                isNew={isNew}
              />
            </div>

            <>
              <div className="grid grid-cols-2 gap-4">
                <InputWrapper
                  required
                  field="startTime"
                  label="Ngày bắt đầu"
                  component={(props: any) => (
                    <DatePicker
                      insetInput
                      type="dateTime"
                      format="dd/MM/yyyy HH:mm:ss"
                      // disabledDate={(current: any) => {
                      //   return moment().add(-1, 'days') >= current;
                      // }}
                      {...props}
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
                      insetInput
                      type="dateTime"
                      format="dd/MM/yyyy HH:mm:ss"
                      showClear
                      // disabledDate={(current: any) => {
                      //   return moment().add(-1, 'days') <= moment(watch('startTime'));
                      // }}
                      {...props}
                    />
                  )}
                  errors={errors}
                  control={control}
                />
              </div>
              {checkFPTemplate() ? (
                <>
                  <Divider dashed />
                  <div className="font-bold">
                    Thông tin chính sách phí{' '}
                    <span className="text-red-700">{getUsedTemplate()}</span>
                  </div>
                  <FPCompanyMainSetting
                    control={control}
                    errors={errors}
                    watch={watch}
                    getValues={getValues}
                    setValue={setValue}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputWrapper
                      label="Tự động áp dụng chính sách phí mới"
                      field="autoApply"
                      component={(props: any) => (
                        <Switch {...props} checked={props.value} />
                      )}
                      errors={errors}
                      control={control}
                    />
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
                  <FormActionButton
                    submitButtonText={`${companyId ? 'Lưu' : 'Tiếp theo'}`}
                    onCancel={companyId ? onCancelCompanyId : onCancel}
                    loading={loading}
                  />
                </>
              ) : (
                ''
              )}
            </>
          </div>
        </form>
      </SpinWrapper>
    </>
  );
};
