import {
  FileManagerButton,
  InputNumber,
  InputNumberByType,
  InputWrapper,
} from '@components/shared';
import {
  CompanySelect,
  FormActionButton,
  SalaryPeriodSelect,
} from '@components/widgets';
import { TransactionTypeSelect } from '@components/widgets/Select/TransactionTypeSelect';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import { DatePicker, Input, Select, TextArea } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { DebtService } from '@services/debt-cash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { createDebt } from 'validations/expenditure';

export const DebtForm = (props: any) => {
  const { onSubmit, onCancel, loading, openModalEdit, filter } = props;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createDebt),
    shouldFocusError: false,
    defaultValues: {
      companyId: filter?.companyIds[0],
      salaryPeriod: '',
      file: null,
      fileName: '',
      transferType: null,
      code: null,
      savedDate: null,
      expiredDate: '',
      type: 'IN_PERIOD',
    },
  });
  const { profile } = useAuth();
  const userRoles = profile?.roles;
  const { data, isLoading, refetch, isFetching } = useQuery(
    ['idEdit', openModalEdit?.id],
    () => DebtService.getDetailDebt(openModalEdit?.id),
    {
      enabled: openModalEdit?.id !== null && openModalEdit?.id !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  useEffect(() => {
    const companyId = watch('companyId');
    if (companyId && !openModalEdit?.id) {
      DebtService.getDebtRandomCode(companyId).then((x: any) => {
        const generatedCode = x?.data;
        if (generatedCode) {
          setValue('code', generatedCode);
        }
      });
    }
  }, [watch('companyId')]);
  useEffect(() => {
    if (!isFetching && !isLoading && openModalEdit?.id) {
      const salaryPeriod = `${data?.salaryPeriodStart}|${data?.salaryPeriodEnd}`;
      reset({
        ...data,
        salaryPeriod: salaryPeriod,
      });
    }
  }, [isLoading, isFetching, openModalEdit?.id]);

  const checkIsEditable = () => {
    if (
      userRoles[0] !== UserRole.ACCOUNTANT &&
      userRoles[0] !== UserRole.BEAM_ADMIN
    )
      return true;

    if (
      userRoles[0] == UserRole.ACCOUNTANT &&
      data?.isUpdatedByAccountant == true
    ) {
      return true;
    } else if (
      userRoles[0] == UserRole.BEAM_ADMIN &&
      data?.isUpdatedByBeamAdmin == true
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <InputWrapper
          required
          label="Doanh nghiệp"
          field="companyId"
          control={control}
          errors={errors}
          component={(e: any) => {
            return (
              <CompanySelect
                disabled={checkIsEditable()}
                className="w-full"
                placeholder="Doanh nghiệp"
                {...e}
              />
            );
          }}
        />
        <InputWrapper
          label="Mã hạch toán"
          field="code"
          control={control}
          errors={errors}
          component={(e: any) => {
            return (
              <Input
                disabled
                className="w-full"
                placeholder="YYYMMDD_Tên viết tắt dn_seq tự tăng"
                value={e.value}
              />
            );
          }}
        />
        <InputWrapper
          required
          label="Kỳ lương"
          field="salaryPeriod"
          control={control}
          errors={errors}
          component={(e: any) => {
            return (
              <SalaryPeriodSelect
                size="large"
                className="w-full"
                placeholder="Chọn kỳ lương"
                companyId={watch('companyId')}
                disabled={checkIsEditable()}
                {...e}
                hasCurrentPeriod={true}
                idDebt={openModalEdit?.id}
                filter={filter}
              />
            );
          }}
        />
        <div className="grid grid-cols-2 items-center gap-4">
          <InputWrapper
            label="Loại công nợ"
            field="type"
            control={control}
            errors={errors}
            required
            component={(e: any) => {
              return (
                <Select
                  disabled={checkIsEditable()}
                  optionList={[
                    {
                      label: 'Công nợ trong kỳ',
                      value: 'IN_PERIOD',
                    },
                    {
                      label: 'Lãi suất quá hạn',
                      value: 'OVERDUE',
                    },
                  ]}
                  {...e}
                />
              );
            }}
          />

          <InputWrapper
            label="Loại giao dịch"
            field="transferType"
            control={control}
            errors={errors}
            required
            component={(e: any) => {
              return (
                <TransactionTypeSelect
                  disabled={
                    // (openModalEdit?.id && data?.transferType == 0) ||
                    checkIsEditable()
                  }
                  onSelect={(value: any) => {
                    if (value === 0) {
                      return setValue('expiredDate', '');
                    }
                  }}
                  className="w-full"
                  {...e}
                />
              );
            }}
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-4">
          <InputWrapper
            label="Số tiền"
            field="moneyAmount"
            control={control}
            errors={errors}
            required
            component={(e: any) => {
              return (
                <InputNumber
                  disabled={checkIsEditable()}
                  format="thousands"
                  className="w-full"
                  placeholder="Số tiền"
                  max={999999999999}
                  {...e}
                />
              );
            }}
          />

          <InputWrapper
            label="Ngày ghi nợ/có"
            field="savedDate"
            control={control}
            errors={errors}
            required
            component={(e: any) => {
              return (
                <DatePicker
                  disabled={checkIsEditable()}
                  className="w-full"
                  disabledDate={(current: any) => {
                    return moment().add(0, 'days') <= current;
                  }}
                  format="dd/MM/yyyy"
                  {...e}
                />
              );
            }}
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-4">
          {watch('type') !== 'OVERDUE' && (
            <>
              <InputWrapper
                label="Ngày đến hạn"
                required={watch('transferType') === 1}
                field="expiredDate"
                control={control}
                errors={errors}
                component={(e: any) => {
                  return (
                    <DatePicker
                      className="w-full"
                      disabled={
                        watch('transferType') == '0' || checkIsEditable()
                      }
                      format="dd/MM/yyyy"
                      {...e}
                    />
                  );
                }}
              />
              <InputWrapper
                label="Lãi suất quá hạn (ngày)"
                field="overdueInterestRate"
                control={control}
                errors={errors}
                component={(e: any) => {
                  return (
                    <InputNumberByType
                      disabled={
                        watch('transferType') == '0' || checkIsEditable()
                      }
                      displayType={1}
                      {...e}
                    />
                  );
                }}
              />
            </>
          )}
        </div>

        <InputWrapper
          label="Ghi chú"
          field="description"
          control={control}
          errors={errors}
          component={(e: any) => {
            return (
              <TextArea
                disabled={checkIsEditable()}
                className="w-full"
                maxLength={500}
                maxCount={500}
                placeholder="Ghi chú"
                {...e}
              />
            );
          }}
        />

        <InputWrapper
          field="file"
          label="File"
          component={(props: any) => (
            <>
              <div className="flex items-center gap-4">
                <FileManagerButton
                  disabled={checkIsEditable()}
                  onOk={(file: any) => {
                    setValue('fileName', file?.originalName);
                    if (file?.name) props.onChange(file?.name);
                  }}
                  url="accounting/upload"
                  urlGet="accounting/get-all"
                  fileSize={10240}
                  fileType="audio/*, video/*, image/*, application/*,text/*"
                />
                <p className="beam-break-world">
                  {watch('fileName') ? watch('fileName') : watch('file')}
                </p>
              </div>
            </>
          )}
          errors={errors}
          control={control}
        />
        {!checkIsEditable() && (
          <FormActionButton onCancel={onCancel} loading={loading} />
        )}
      </div>
    </form>
  );
};
