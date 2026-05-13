import { Select } from '@douyinfe/semi-ui';
import React, { forwardRef } from 'react';

export const ReportTypeSelect = forwardRef<any, any>((props: any, ref: any) => {
  const { onChange, value, companyId, multiple = false } = props;

  return (
    <Select
      ref={ref}
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
});
ReportTypeSelect.displayName = 'ReportTypeSelect';
