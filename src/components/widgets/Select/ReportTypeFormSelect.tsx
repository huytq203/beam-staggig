import { Select } from '@douyinfe/semi-ui';
import React, { forwardRef } from 'react';

export const ReportTypeFormSelect = forwardRef<any, any>((props: any, ref: any) => {
  const { onChange, value, companyId, multiple = false, hr } = props;

  return (
    <Select
      ref={ref}
      // value={value}
      // filter={FunctionBase.customSelectFilterOption}
      // disabled={hr === 'hr_admin'}
      defaultValue={'BEAM_UPLOAD'}
      optionList={
        hr === 'hr_admin'
          ? [
              {
                label: 'Báo cáo đối soát',
                value: 'BEAM_UPLOAD',
              },
              {
                label: 'Báo cáo chốt pdf',
                value: 'BEAM_FINAL_PDF',
              },
            ]
          : [
              {
                label: 'Báo cáo đối soát',
                value: 'BEAM_UPLOAD',
              },
              {
                label: 'Báo cáo chốt đối soát',
                value: 'BEAM_FINAL',
              },
              {
                label: 'Báo cáo chốt pdf',
                value: 'BEAM_FINAL_PDF',
              },
            ]
      }
      placeholder="Chọn loại báo cáo"
      onChange={onChange}
      multiple={multiple}
    />
  );
});
ReportTypeFormSelect.displayName = 'ReportTypeFormSelect';
