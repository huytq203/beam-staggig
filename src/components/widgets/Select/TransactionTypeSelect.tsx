import { Select } from '@douyinfe/semi-ui';

export const TransactionTypeSelect = (props: any) => {
  const { onChange, value, disabled = false, onSelect } = props;

  return (
    <Select
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
};
