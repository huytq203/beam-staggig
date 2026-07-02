import { Select } from '@douyinfe/semi-ui';
import { forwardRef } from 'react';

export const endUserStatusOptions = [
  { value: 1, label: 'Hoạt động' },
  { value: 0, label: 'Không hoạt động' },
];

export const EnabledStatusSelect = forwardRef<any, any>(
  ({ value, onChange, ...rest }, ref) => (
    <Select
      ref={ref}
      optionList={endUserStatusOptions}
      value={value ? 1 : 0}
      onChange={(v: any) => onChange?.(v === 1)}
      {...rest}
    />
  )
);
EnabledStatusSelect.displayName = 'EnabledStatusSelect';
