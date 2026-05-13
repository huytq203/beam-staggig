import { COMMON_FORMAT } from '@constants/common-format';
import { Select } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { DebtService } from '@services/debt-cash';
import { useRouter } from 'next/router';
import { forwardRef, useEffect } from 'react';
import { useQuery } from 'react-query';

export const SalaryPeriodSelect = forwardRef<any, any>((props: any, ref: any) => {
  const router = useRouter();
  const { companyId: companyRouter } = router.query;
  const {
    onChange,
    value,
    companyId,
    multiple = false,
    placeholder,
    idDebt,
    disabled,
    filter,
  } = props;

  const { data, isLoading, refetch } = useQuery(
    ['salary-period-list-select', companyId],
    () => DebtService.getAllSalaryPeriods(companyId),
    {
      enabled: companyId != null && companyId.length > 0,
      refetchOnWindowFocus: false,
    }
  );
  useEffect(() => {
    if (
      companyRouter !== companyId &&
      (idDebt === undefined ||
        idDebt === null ||
        companyId !== filter?.companyIds[0])
    ) {
      onChange([]);
    }
  }, [companyId]);
  const getOptions = () => {
    if (!data) return [];
    // return data?.data
    //   ?.sort(function (a: any, b: any) {
    //     if (a && b) {
    //       return +new Date(b.endDate) - +new Date(a.endDate);
    //     } else {
    //       return 0;
    //     }
    //   })

    return data?.data?.map((x: any, idx: any) => {
      return {
        label: `${DateTimeHelper.formatDateTime(
          x.startDate,
          COMMON_FORMAT.DATE
        )} - ${DateTimeHelper.formatDateTime(x.endDate, COMMON_FORMAT.DATE)}`,
        value: `${x.startDate}|${x.endDate}`,
      };
    });
  };
  return (
    <Select
      ref={ref}
      loading={isLoading}
      value={value}
      optionList={getOptions()}
      placeholder={placeholder}
      onChange={(e: any) => onChange(e)}
      multiple={multiple}
      disabled={disabled}
    />
  );
});
SalaryPeriodSelect.displayName = 'SalaryPeriodSelect';
