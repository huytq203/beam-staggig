import { Select } from '@douyinfe/semi-ui';
import { forwardRef } from 'react';

export const TransactionTypeSelect = forwardRef<any, any>((props: any, ref: any) => {
  const { onChange, value, disabled = false, onSelect } = props;

  return (
    <Select
      ref={ref}
      {...props}
      // filter={FunctionBase.customSelectFilterOption}
      value={value}
      optionList={[
        {
          label: 'Ghi nợ',
          value: 1,
        },
        {
          label: 'Ghi có',
          value: 0,
        },
      ]}
      onSelect={onSelect}
      disabled={disabled}
      placeholder="Chọn loại giao dịch"
      onChange={(e: any) => onChange(e)}
    />
  );
});
TransactionTypeSelect.displayName = 'TransactionTypeSelect';
