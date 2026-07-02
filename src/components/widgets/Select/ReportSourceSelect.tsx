import { Select } from '@douyinfe/semi-ui';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import React, { forwardRef } from 'react';

export const ReportSourceSelect = forwardRef<any, any>((props: any, ref: any) => {
  const { onChange, value, companyId, multiple = false } = props;

  return (
    <Select
      ref={ref}
      // filter={FunctionBase.customSelectFilterOption}
      value={value}
      optionList={[
        {
          label: 'BEAM',
          value: 0,
        },
        {
          label: 'Doanh nghiệp',
          value: 1,
        },
      ]}
      placeholder="Chọn nguồn báo cáo"
      onChange={(e: any) => onChange(e)}
      multiple={multiple}
      showClear
    />
  );
});
ReportSourceSelect.displayName = 'ReportSourceSelect';
