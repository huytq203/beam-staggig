import { COMMON_FORMAT } from '@constants/common-format';
import { Select, TreeSelect } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { DebtService } from '@services/debt-cash';
import { forwardRef, useEffect } from 'react';
import { useQuery } from 'react-query';

export const SalaryPeriodCashFlowSelect = forwardRef<any, any>((props: any, ref: any) => {
  const { onChange, value, companyId, multiple = false, placeholder } = props;

  const { data, isLoading } = useQuery(
    ['salary-period-list-select', companyId],
    () =>
      DebtService.getSalaryPeriodCashFlow({
        companyIds: companyId,
      }),
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

    return data
      ?.filter((x: any) => x.periods.length > 0)
      .map((company: any, idx: any) => {
        return {
          label: company.companyName,
          value: company.companyId,
          key: `${idx}`,
          children: company.periods
            ?.sort(function (a: any, b: any) {
              if (a && b) {
                return +new Date(b.endDate) - +new Date(a.endDate);
              } else {
                return 0;
              }
            })
            ?.map((period: any, idy: any) => {
              return {
                label: `${DateTimeHelper.formatDateTime(
                  period.startDate,
                  COMMON_FORMAT.DATE
                )} - ${DateTimeHelper.formatDateTime(
                  period.endDate,
                  COMMON_FORMAT.DATE
                )}`,
                value: `${company.companyId}|${period.startDate}|${period.endDate}`,
                key: `${idx}-${idy}`,
              };
            }),
        };
      });
  };
  return (
    <TreeSelect
      ref={ref}
      // style={{ width: 300 }}
      // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={getOptions()}
      multiple
      leafOnly
      placeholder="Chọn kỳ lương"
      onChange={(e: any) => onChange(e)}
    />
  );
});
SalaryPeriodCashFlowSelect.displayName = 'SalaryPeriodCashFlowSelect';
