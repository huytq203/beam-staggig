import { Select } from '@douyinfe/semi-ui';
import { forwardRef } from 'react';

export const CashflowPayStatusSelect = forwardRef<any, any>((props: any, ref: any) => {
  const { onChange, value } = props;

  return (
    <Select
      ref={ref}
      value={value}
      optionList={[
        {
          label: 'Chậm thanh toán',
          value: 0,
        },
        {
          label: 'Trong kỳ',
          value: 1,
        },
        {
          label: 'Đã thanh toán',
          value: 2,
        },
        {
          label: 'Nợ',
          value: 3,
        },
      ]}
      placeholder="Chọn trạng thái thanh toán"
      onChange={(e: any) => onChange(e)}
      showClear
    />
  );
});
CashflowPayStatusSelect.displayName = 'CashflowPayStatusSelect';
