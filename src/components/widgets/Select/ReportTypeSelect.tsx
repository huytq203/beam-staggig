import { Select } from '@douyinfe/semi-ui';
import React from 'react';

export const ReportTypeSelect = (props: any) => {
  const { onChange, value, companyId, multiple = false } = props;

  return (
    <Select
      // filter={FunctionBase.customSelectFilterOption}
      value={value}
      defaultValue={'BEAM'}
      optionList={[
        {
          label: 'Báo cáo gốc',
          value: 'BEAM',
        },
        {
          label: 'Báo cáo đối soát',
          value: 'UPLOAD',
        },
        {
          label: 'Báo cáo chốt đối soát',
          value: 'FINAL',
        },
        {
          label: 'Báo cáo chốt có xác nhận (PDF)',
          value: 'FINAL_PDF',
        },
      ]}
      placeholder="Chọn loại báo cáo"
      onChange={(e: any) => onChange(e)}
      multiple={multiple}
      showClear
    />
  );
};
