import { InputWrapper } from '@components/shared';
import {
  CashflowPayStatusSelect,
  CompanySelect,
  SalaryPeriodCashFlowSelect,
  SalaryPeriodStatusSelect,
} from '@components/widgets';
import { Button } from '@douyinfe/semi-ui';
import { useForm } from 'react-hook-form';

export interface CashflowOverviewFilterProps {
  onSubmit?: any;
}

export const CashflowListFilter = (props: CashflowOverviewFilterProps) => {
  const { onSubmit } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyIds: null,
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-4 gap-4">
          <InputWrapper
            field="companyIds"
            label="Lựa chọn doanh nghiệp"
            control={control}
            errors={errors}
            component={(e: any) => <CompanySelect {...e} multiple={true} />}
          />

          <InputWrapper
            field="periods"
            label="Lựa chọn kỳ công"
            control={control}
            errors={errors}
            component={(e: any) => (
              <SalaryPeriodCashFlowSelect
                companyId={watch('companyIds')}
                placeholder="Chọn kỳ lương"
                {...e}
              />
            )}
          />

          <InputWrapper
            field="status"
            label="Trạng thái kỳ lương"
            control={control}
            errors={errors}
            component={(e: any) => (
              <SalaryPeriodStatusSelect size="large" {...e} />
            )}
          />

          <InputWrapper
            field="payStatus"
            label="Trạng thái thanh toán"
            control={control}
            errors={errors}
            component={(e: any) => (
              <CashflowPayStatusSelect size="large" {...e} />
            )}
          />

          <Button theme="solid" htmlType="submit">
            Tra cứu
          </Button>
        </div>
      </form>
    </div>
  );
};
