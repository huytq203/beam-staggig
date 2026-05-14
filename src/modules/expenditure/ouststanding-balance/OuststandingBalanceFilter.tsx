import { InputWrapper } from '@components/shared';
import { BoxWrapper, SalaryPeriodSelect } from '@components/widgets';
import { Button, Select } from '@douyinfe/semi-ui';
import { HRCompany } from '@services/hr-api';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useAuth } from '@contexts/authentication';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { useRouter } from 'next/router';
export interface ExpenditureDebtListFilterProps {
  onSubmit: any;
  companyData: any;
  refetch: any;
  setFilter?: any;
  filter?: any;
}

export const OuststandingBalanceFilter = (props: any) => {
  const { onSubmit, companyData, refetch, setFilter, filter } = props;
  const { profile } = useAuth();
  const userRoles = profile?.roles;
  const [enabled, setEnabled] = useState(false);
  const [hr, setHr] = useState('');
  const router = useRouter();
  const {
    companyId: companyRouter,
    startDate: startDate,
    endDate: endDate,
  } = router.query;
  useEffect(() => {
    if (userRoles !== undefined) {
      setEnabled(userRoles[0] === 'hr_admin' ? true : false);
      setHr(userRoles[0]);
    } else {
      setEnabled(false);
    }
  }, [userRoles]);
  const { data, isLoading } = useQuery(
    ['hr-company'],
    () => HRCompany.getHRCompanyId(),
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const companyId =
    userRoles !== undefined && userRoles[0] === 'hr_admin' && data?.length < 2
      ? data[0]?.id
      : null;
  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyIds: '',
      periods: [''],
    },
  });
  useEffect(() => {
    reset({
      ...getValues(),
      companyIds: companyRouter ? companyRouter : companyId,
    });
    if (watch('companyIds') && watch('periods').length > 0) {
      setFilter &&
        setFilter({
          companyIds: [watch('companyIds')],
        });
      if (filter !== null) {
        refetch();
      }
    }
  }, [companyRouter]);
  const getOptions = () => {
    if (!companyData) return [];
    return companyData?.map((x: any, idx: any) => {
      return {
        label: `${x.name} (${x.index}) (${x.taxIdentificationNumber})`,
        value: x.id,
      };
    });
  };
  const submitFilter = (values: any) => {
    onSubmit &&
      onSubmit({
        companyIds: values.companyIds !== null ? values.companyIds : companyId,
      });
    if (filter !== null) {
      refetch && refetch();
    }
  };
  return (
    <BoxWrapper padding={8}>
      <form onSubmit={handleSubmit(submitFilter)}>
        <div className="grid grid-cols-2 items-center gap-4">
          <InputWrapper
            field="companyIds"
            label="Doanh nghiệp"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select
                filter={FunctionBase.customSelectFilterOption}
                loading={isLoading}
                optionList={getOptions()}
                placeholder="Chọn doanh nghiệp/MST"
                // defaultValue={listCompany[0]?.id}
                {...e}
                max={100}
              />
            )}
          />
          <InputWrapper
            component={(customProps: any) => (
              <Button htmlType="submit" theme="solid">
                Tra cứu
              </Button>
            )}
          />
        </div>
      </form>
    </BoxWrapper>
  );
};
