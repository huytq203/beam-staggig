import { UserRole } from '@constants/auth.constants';
import { Select } from '@douyinfe/semi-ui';
import type { SelectProps } from '@douyinfe/semi-ui/lib/es/select';
import { ProtectedWrapper } from '../Auth';
import { forwardRef } from 'react';

const roleListSuper = [
  { value: 'beam_admin', label: 'Beam Admin' },
  { value: 'reconciler', label: 'Đối soát viên' },
  { value: 'accountant', label: 'Kế toán viên' },
  { value: 'controller', label: 'Kiểm soát viên' },
  { value: 'sale', label: 'Cán bộ kinh doanh' },
  { value: 'cs', label: 'Dịch vụ khách hàng' },
];

const roleListBeam = roleListSuper.filter(
  ({ value }) => value !== UserRole.BEAM_ADMIN
);

type RolesSelectProps = Omit<SelectProps, 'optionList'>;

export const RolesSelect = forwardRef<any, RolesSelectProps>((props, ref) => {
  const {
    className = 'w-full',
    multiple = false,
    onChange,
    placeholder = 'Chọn quyền',
    showClear = false,
    size = 'large',
    value,
    ...selectProps
  } = props;

  const renderSelect = (optionList: SelectProps['optionList']) => (
    <Select
      {...selectProps}
      ref={ref}
      className={className}
      multiple={multiple}
      onChange={onChange}
      optionList={optionList}
      placeholder={placeholder}
      showClear={showClear}
      size={size}
      value={value}
    />
  );

  return (
    <>
      <ProtectedWrapper allowedRoles={[UserRole.SUPER_ADMIN]}>
        {renderSelect(roleListSuper)}
      </ProtectedWrapper>
      <ProtectedWrapper
        allowedRoles={[UserRole.BEAM_ADMIN, UserRole.CONTROLLER, UserRole.SALE]}
      >
        {renderSelect(roleListBeam)}
      </ProtectedWrapper>
    </>
  );
});
RolesSelect.displayName = 'RolesSelect';
