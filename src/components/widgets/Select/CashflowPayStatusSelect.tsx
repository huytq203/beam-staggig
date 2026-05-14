import { Select } from '@douyinfe/semi-ui';

export const CashflowPayStatusSelect = (props: any) => {
  const { onChange, value } = props;

  return (
    <Select
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
};
