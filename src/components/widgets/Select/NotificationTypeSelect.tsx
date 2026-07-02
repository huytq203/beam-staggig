import { Select } from '@douyinfe/semi-ui';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import React, { forwardRef } from 'react';

export const NotificationTypeSelect = forwardRef<any, any>((props: any, ref: any) => {
  const { onChange, value, disabled, multiple = false } = props;

  return (
    <Select
      ref={ref}
      value={value}
      optionList={[
        // {
        //   label: 'Thông báo cảnh báo',
        //   value: 'ALERT',
        // },
        {
          label: 'Thông báo có điều kiện',
          value: 'CONDITION',
        },
        {
          label: 'Thông báo giao dịch',
          value: 'TRANSACTION',
        },
        // {
        //   label: 'Thông báo hệ thống',
        //   value: 'SYSTEM',
        // },
        {
          label: 'Thông báo yêu cầu',
          value: 'TICKET',
        },
        {
          label: 'Thông báo giới thiệu bạn bè',
          value: 'FRIEND_INVITATION',
        },
        {
          label: 'Thông báo hồ sơ',
          value: 'PROFILE',
        },
        {
          label: 'Thông báo công nợ',
          value: 'ACCOUNTING',
        },
        {
          label: 'Thông báo đối soát',
          value: 'RECONCILIATION',
        },
        {
          label: 'Chặn trùng thông tin của NLĐ',
          value: 'VALIDATE_EMPLOYEE_INFORMATION',
        },
        {
          label: 'Thông báo giải thưởng chiếc hộp thần kỳ',
          value: 'LUCKY_BOX_REWARD',
        },
        // {
        //   label: 'Thông báo CSKH',
        //   value: 'CUSTOMER_CARE',
        // },
      ]}
      // filter={FunctionBase.customSelectFilterOption}
      disabled={disabled}
      placeholder="Chọn nhóm thông báo"
      onChange={(e: any) => onChange(e)}
      multiple={multiple}
      // showClear
    />
  );
});
NotificationTypeSelect.displayName = 'NotificationTypeSelect';
