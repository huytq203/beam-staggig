import { Select } from '@douyinfe/semi-ui';
import React from 'react';

export const ReportTypeFormSelect = (props: any) => {
  const { onChange, value, companyId, multiple = false, hr } = props;

  return (
    <Select
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
};
