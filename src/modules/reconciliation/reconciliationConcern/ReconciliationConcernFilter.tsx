import { InputWrapper } from '@components/shared';
import { SalaryPeriodSelect } from '@components/widgets';
import { ReportSourceSelect } from '@components/widgets/Select/ReportSourceSelect';
import { ReportTypeSelect } from '@components/widgets/Select/ReportTypeSelect';
import { useAuth } from '@contexts/authentication';
import { Button, DatePicker, Select } from '@douyinfe/semi-ui';
import { HRCompany } from '@services/hr-api';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { UploadReconciliationFile } from './UploadReconciliationFile';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import { reconciliationConcernFilter } from 'validations/reconciliation';
import { useRouter } from 'next/router';

export interface CashflowOverviewFilterProps {
  onSubmit?: any;
  refetch?: any;
  filter?: any;
  companyData?: any;
  setFilter?: any;
}

const ReconciliationConcernFilter = (props: CashflowOverviewFilterProps) => {
  const { onSubmit, refetch, filter, companyData, setFilter } = props;
  const { profile } = useAuth();
  const router = useRouter();
  const {
    companyId: companyRouter,
    startDate: startDate,
    endDate: endDate,
  } = router.query;
  const userRoles = profile?.roles;
  const [enabled, setEnabled] = useState(false);
  const [hr, setHr] = useState('');
  useEffect(() => {
    if (userRoles !== undefined) {
      setEnabled(userRoles[0] && userRoles[0] === 'hr_admin' ? true : false);
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
    reset,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reconciliationConcernFilter),
    defaultValues: {
      companyIds: '',
      periods: startDate ? [`${startDate}|${endDate}`] : [],
      type: null,
      dateRanges: null,
      source: null,
      companyDataLength: companyData?.length,
    },
  });
  const getOptions = () => {
    if (!companyData) return [];
    return companyData?.map((x: any, idx: any) => {
      return {
        label: `${x.name} (${x.index}) (${x.taxIdentificationNumber})`,
        value: x.id,
      };
    });
  };
  useEffect(() => {
    reset({
      ...getValues(),
      companyIds: companyRouter ? companyRouter : companyId,
      periods: startDate ? [`${startDate}|${endDate}`] : [],
    });
    if (watch('companyIds') && watch('periods').length > 0) {
      const periods = watch('periods').map((x: any) => {
        const periodsString = x.split('|');
        return periodsString[0] + 'T00:00:00';
      });
      setFilter &&
        setFilter({
          companyId: watch('companyIds'),
          periods: periods,
          type: null,
          source: null,
          endTime: null,
          startTime: null,
        });
      if (filter !== null) {
        refetch();
      }
    }
  }, [companyRouter]);
  const submitFilter = (values: any) => {
    onSubmit &&
      onSubmit({
        periods: values.periods,
        companyIds: values.companyIds !== null ? values.companyIds : companyId,
        type: values.type,
        dateRanges: values.dateRanges,
        source: values.source,
      });
  };

  const getCompanyIdUpload = (
    companyIdByForm: any,
    companyIdByData: any,
    companyData: any
  ) => {
    if (companyData?.length == 1) {
      if (
        companyIdByData !== null &&
        companyIdByData !== undefined &&
        companyIdByData !== ''
      ) {
        return companyIdByData;
      }
      return null;
    } else if (
      companyIdByForm !== null &&
      companyIdByForm !== undefined &&
      companyIdByForm !== ''
    ) {
      return companyIdByForm;
    } else {
      return null;
    }
  };

  return (
    <div>
      <div>
        <p className="font-bold text-2xl mb-4">Đối soát với doanh nghiệp</p>
      </div>
      <form onSubmit={handleSubmit(submitFilter)}>
        <div className="grid grid-cols-3 gap-4">
          {companyData?.length > 1 && (
            <InputWrapper
              required
              field="companyIds"
              label="Doanh nghiệp"
              control={control}
              errors={errors}
              component={(e: any) => (
                <Select
                  filter={FunctionBase.customSelectFilterOption}
                  loading={isLoading}
                  optionList={getOptions()}
                  placeholder="Chọn doanh nghiệp/Mã DN/MST"
                  // defaultValue={listCompany[0]?.id}
                  {...e}
                  max={100}
                  showClear
                />
              )}
            />
          )}

          <InputWrapper
            required
            field="periods"
            label="Kỳ đối soát"
            control={control}
            errors={errors}
            component={(e: any) => (
              <SalaryPeriodSelect
                multiple
                companyId={
                  watch('companyIds') !== null && watch('companyIds') !== ''
                    ? watch('companyIds')
                    : companyId
                }
                placeholder="Chọn kỳ đối soát"
                size="large"
                {...e}
                hasCurrentPeriod={false}
              />
            )}
          />

          <InputWrapper
            field="type"
            label="Loại báo cáo"
            control={control}
            errors={errors}
            component={(e: any) => (
              <ReportTypeSelect size="large" {...e} multiple={true} />
            )}
          />

          <InputWrapper
            field="source"
            label="Nguồn báo cáo"
            control={control}
            errors={errors}
            component={(e: any) => <ReportSourceSelect size="large" {...e} />}
          />
          <InputWrapper
            field="dateRanges"
            label="Ngày gửi báo cáo"
            component={(props: any) => (
              <DatePicker
                type="dateTimeRange"
                insetInput
                format="dd/MM/yyyy HH:mm:ss"
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5">
          <Button theme="solid" htmlType="submit">
            Tra cứu
          </Button>
          <UploadReconciliationFile
            afterSubmit={() => {
              if (watch('periods').length !== 0 && filter !== null) {
                refetch();
              }
            }}
            hr={hr}
            enabled={enabled}
            companyId={getCompanyIdUpload(
              watch('companyIds'),
              companyId,
              companyData
            )}
          />
        </div>
      </form>
    </div>
  );
};

export default ReconciliationConcernFilter;
