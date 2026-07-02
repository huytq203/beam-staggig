import { Select } from '@douyinfe/semi-ui';
import { forwardRef } from 'react';

export const SalaryPeriodStatusSelect = forwardRef<any, any>((props: any, ref: any) => {
  const { onChange, value, companyId, multiple = false } = props;

  return (
    <Select
      ref={ref}
      value={value}
      optionList={[
        {
          label: 'Trong kỳ',
          value: 0,
        },
        {
          label: 'Kết thúc',
          value: 1,
        },
      ]}
      placeholder="Chọn trạng thái kỳ lương"
      onChange={(e: any) => onChange(e)}
      multiple={multiple}
      showClear
    />
  );
});
SalaryPeriodStatusSelect.displayName = 'SalaryPeriodStatusSelect';
