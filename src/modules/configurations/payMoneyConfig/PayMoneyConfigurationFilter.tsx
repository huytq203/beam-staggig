import { InputWrapper } from '@components/shared';
import { CompanySelect } from '@components/widgets';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconHistory } from '@douyinfe/semi-icons';

import { Button, DatePicker, Select } from '@douyinfe/semi-ui';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { PayMoneyDefault } from './PayMoneyDefault';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { listStatusPayMoney } from '@constants/select-options.constants';

export const PayMoneyConfigurationFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      page: 1,
      size: 10,
      companyIds: '',
      bankCode: '',
      status: '',
      dateRanges: [],
    },
  });
  const router = useRouter();

  useEffect(() => {
    reset({
      ...getValues(),
      companyIds: '',
    });
  }, []);

  const onSubmitValues = (values: any) => {
    return onFilter({
      ...values,
      startDate: values.dateRanges[0]
        ? moment(values.dateRanges[0]).format(
            COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
          )
        : '',
      endDate: values.dateRanges[1]
        ? moment(values.dateRanges[1]).format(
            COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
          )
        : '',
      companyIds: values.companyIds ? values.companyIds : '',
      bankCode: values.bankCode,
      status: values.status,
    });
  };

  const handleSetupClick = () => {
    router.push('/configurations/pay-money/create');
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-2 gap-4 my-4">
          <InputWrapper
            field="companyIds"
            label="Doanh nghiệp"
            component={(field: any) => <CompanySelect {...field} />}
            errors={errors}
            control={control}
          />
          <InputWrapper
            field="bankCode"
            label="Ngân hàng đi tiền"
            component={(field: any) => (
              <Select
                placeholder="Chọn nguồn tiền"
                optionList={[
                  {
                    label: 'Tất cả',
                    value: '',
                  },
                  {
                    label: 'VPBank',
                    value: 'VPBANK',
                  },
                  {
                    label: 'PVcomBank',
                    value: 'PVCOMBANK',
                  },
                  {
                    label: 'VietcomBank',
                    value: 'VIETCOMBANK',
                  },
                ]}
                {...field}
              />
            )}
            errors={errors}
            control={control}
          />
          <InputWrapper
            field="status"
            label="Trạng thái"
            component={(field: any) => (
              <Select optionList={listStatusPayMoney} {...field} />
            )}
            errors={errors}
            control={control}
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
          <PayMoneyDefault />
          <div className='grid grid-cols-2 gap-2 my-6'>
          <ProtectedWrapper
                  allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
          >
           <Button theme= "light" onClick={handleSetupClick}>
              Thiết lập 
              </Button>
          </ProtectedWrapper>
           <InputWrapper
            component={(e: any) => {
              return (
                <Button theme="solid" htmlType="submit">
                  Tìm kiếm
                </Button>
              );
            }}
          />

         </div>
        </div>
      </form>
    </>
  );
};
