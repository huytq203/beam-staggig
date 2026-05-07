import { Select } from '@douyinfe/semi-ui';

export const SalaryPeriodStatusSelect = (props: any) => {
  const { onChange, value, companyId, multiple = false } = props;

  return (
    <Select
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
};
