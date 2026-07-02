import { COMMON_FORMAT } from '@constants/common-format';
import { Select } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { DebtService } from '@services/debt-cash';
import { forwardRef, useEffect } from 'react';
import { useQuery } from 'react-query';

export const SalaryPeriodRecoliiationSelect = forwardRef<any, any>((props: any, ref: any) => {
  const {
    onChange,
    value,
    companyId,
    multiple = false,
    placeholder,
    hasCurrentPeriod = true,
  } = props;

  const { data, isLoading } = useQuery(
    ['salary-period-list-select', companyId],
    () => DebtService.getAllSalaryPeriods(companyId),
    {
      enabled: companyId != null,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    onChange([]);
  }, [companyId]);
  const getOptions = () => {
    if (!data) return [];
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
      optionList={getOptions()}
      placeholder={placeholder}
      onChange={onChange}
      multiple={multiple}
    />
  );
});
SalaryPeriodRecoliiationSelect.displayName = 'SalaryPeriodRecoliiationSelect';
