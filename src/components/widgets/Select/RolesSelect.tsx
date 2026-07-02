import { UserRole } from '@constants/auth.constants';
import { Select } from '@douyinfe/semi-ui';
import { ProtectedWrapper } from '../Auth';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { forwardRef } from 'react';

export const RolesSelect = forwardRef<any, any>((props: any, ref: any) => {
  const { onChange, value, multiple = false, showClear = false } = props;
  const roleListSupper = [
    {
      value: 'beam_admin',
      label: 'Beam Admin',
    },
    {
      value: 'reconciler',
      label: 'Đối soát viên',
    },
    {
      value: 'accountant',
      label: 'Kế toán viên',
    },
    {
      value: 'controller',
      label: 'Kiểm soát viên',
    },
    {
      value: 'sale',
      label: 'Cán bộ kinh doanh',
    },
    {
      value: 'cs',
      label: 'Dịch vụ khách hàng',
    },
  ];
  const roleListBeam = [
    {
      value: 'reconciler',
      label: 'Đối soát viên',
    },
    {
      value: 'accountant',
      label: 'Kế toán viên',
    },
    {
      value: 'controller',
      label: 'Kiểm soát viên',
    },
    {
      value: 'sale',
      label: 'Cán bộ kinh doanh',
    },
    {
      value: 'cs',
      label: 'Dịch vụ khách hàng',
    },
  ];
  return (
    <>
      <ProtectedWrapper allowedRoles={[UserRole.SUPER_ADMIN]}>
        <Select
          ref={ref}
          // filter={FunctionBase.customSelectFilterOption}
          value={value}
          optionList={roleListSupper}
          placeholder="Chọn quyền"
          onChange={(e: any) => onChange(e)}
          multiple={multiple}
          showClear={showClear}
        />
      </ProtectedWrapper>
      <ProtectedWrapper
        allowedRoles={[UserRole.BEAM_ADMIN, UserRole.CONTROLLER, UserRole.SALE]}
      >
        <Select
          ref={ref}
          // filter={FunctionBase.customSelectFilterOption}
          value={value}
          optionList={roleListBeam}
          placeholder="Chọn quyền"
          onChange={(e: any) => onChange(e)}
          multiple={multiple}
          showClear={showClear}
        />
      </ProtectedWrapper>
    </>
  );
});
RolesSelect.displayName = 'RolesSelect';
