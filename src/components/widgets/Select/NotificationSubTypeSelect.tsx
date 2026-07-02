import { Select } from '@douyinfe/semi-ui';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import React, { forwardRef } from 'react';

export const NotificationSubTypeSelect = forwardRef<any, any>((props: any, ref: any) => {
  const {
    onChange,
    value,
    type,
    disabled,
    multiple = false,
    className,
  } = props;
  const objsList = [
    {
      type: 'ALERT',
      options: [
        {
          label: 'Hạn mức doanh nghiệp chạm ngưỡng',
          value: 'EXCEED',
        },
        {
          label: 'Hết hạn mức doanh nghiệp',
          value: 'OUT_OF',
        },
        {
          label: 'Hạn mức Beam chạm ngưỡng',
          value: 'BEAM_EXCEED',
        },
        {
          label: 'Hết hạn mức Beam',
          value: 'BEAM_OUT_OF',
        },
        {
          label: 'Hết hạn mức ngày của Beam',
          value: 'BEAM_DAY_OUT_OF',
        },
        {
          label: 'Giao dịch bất thường',
          value: 'ABNORMAL_TRANSACTION',
        },
        {
          label: 'Cảnh báo đăng nhập lạ',
          value: 'ABNORMAL_LOGIN',
        },
      ],
    },
    {
      type: 'CONDITION',
      options: [
        // {
        //   label: 'Tạm khóa ứng lương',
        //   value: 'TEMP_BLOCK_SALARY_ADVANCE',
        // },
        // {
        //   label: 'Hết hạn hợp đồng',
        //   value: 'CONTRACT_EXPIRED',
        // },
        // {
        //   label: 'Thay đổi quy tắc ứng',
        //   value: 'RULE_CHANGE',
        // },
        {
          label: 'Thông báo NLĐ bị đánh dấu Nghỉ việc',
          value: 'DISABLE_EMPLOYEE',
        },
        // {
        //   label: 'Thay đổi hạn mức',
        //   value: 'PAYLIMIT_CHANGE',
        // },
        // {
        //   label: 'Đối soát kì lương',
        //   value: 'FOR_CONTROL_SALARY_PERIOD',
        // },
        // {
        //   label: 'Đến hạn thanh toán',
        //   value: 'PAY_LAST_DAY',
        // },
        // {
        //   label: 'Mở khóa lương',
        //   value: 'OPEN_SALARY_ADVANCE',
        // },
        // {
        //   label: 'Khóa ứng lương',
        //   value: 'BLOCK_SALARY_ADVANCE',
        // },
      ],
    },
    {
      type: 'TRANSACTION',
      options: [
        {
          label: 'Giao dịch thành công',
          value: 'SUCCESS_TRANSACTION',
        },
        {
          label: 'Giao dịch thất bại',
          value: 'FAIL_TRANSACTION',
        },
        {
          label: 'Giao dịch đang xử lý',
          value: 'PROCESSING_TRANSACTION',
        },
      ],
    },
    {
      type: 'SYSTEM',
      options: [
        {
          label: 'Bảo trì hệ thống',
          value: 'MAINTAIN_WEB',
        },
        {
          label: 'Bảo trì hệ thống',
          value: 'MAINTAIN_MOBILE',
        },
      ],
    },
    {
      type: 'TICKET',
      options: [
        {
          label: 'Yêu cầu thay đổi thông tin đang chờ duyệt',
          value: 'INFORMATION_PENDING',
        },
        {
          label: 'Yêu cầu thay đổi thông tin đã phê duyệt',
          value: 'INFORMATION_ACCEPT',
        },
        {
          label: 'Yêu cầu thay đổi thông tin đã từ chối',
          value: 'INFORMATION_REJECT',
        },
        {
          label: 'Yêu cầu đăng ký dịch vụ ứng lương đang chờ duyệt',
          value: 'SALARY_ADVANCE_PENDING',
        },
        {
          label: 'Yêu cầu đăng ký dịch vụ ứng lương đã phê duyệt',
          value: 'SALARY_ADVANCE_ACCEPT',
        },
        {
          label: 'Yêu cầu đăng ký dịch vụ ứng lương đã từ chối',
          value: 'SALARY_ADVANCE_REJECT',
        },
        {
          label: 'Yêu cầu phê duyệt giao dịch lệch',
          value: 'TRANSACTION_NOT_MATCH_PENDING',
        },
        {
          label: 'Yêu cầu phê duyệt giao dịch lệch được duyệt',
          value: 'TRANSACTION_NOT_MATCH_ACCEPT',
        },
        {
          label: 'Yêu cầu phê duyệt giao dịch lệch bị từ chối',
          value: 'TRANSACTION_NOT_MATCH_REJECT',
        },
        {
          label: 'Yêu cầu tra soát đang xử lý',
          value: 'INVEST_PENDING',
        },
        {
          label: 'Yêu cầu tra soát được gửi thành công',
          value: 'INVEST_ACCEPT',
        },
        {
          label: 'Yêu cầu đăng ký ứng lương tại doanh nghiệp chưa ký kết',
          value: 'TICKET_NEW_COMPANY',
        },
        {
          label: 'Yêu cầu ứng lương đang chờ duyệt',
          value: 'NEW_SALARY_ADVANCE_PENDING_TICKET',
        },
        {
          label: 'Yêu cầu ứng lương được duyệt',
          value: 'ACCEPTED_SALARY_ADVANCE_TICKET',
        },
        {
          label: 'Yêu cầu ứng lương bị từ chối',
          value: 'REJECTED_SALARY_ADVANCE_TICKET',
        },
        {
          label: 'Yêu cầu ứng lương bị huỷ',
          value: 'CANCELED_SALARY_ADVANCE_TICKET',
        },
      ],
    },
    {
      type: 'CUSTOMER_CARE',
      options: [
        {
          label: 'Chăm sóc khách hàng',
          value: 'CUSTOMER_CARE',
        },
      ],
    },
    {
      type: 'FRIEND_INVITATION',
      options: [
        {
          label: 'Hạn mức chi thưởng của chương trình sắp hết',
          value: 'ALERT_BUDGET_UNDER_500K',
        },
        {
          label:
            'NLĐ đăng ký tham gia chương trình giới thiệu bạn bè thành công',
          value: 'SUCCESS_REGISTRATION',
        },
        {
          label:
            'Người được giới thiệu thực hiện đăng ký công ty mới thành công',
          value: 'SUCCESS_NEW_COMPANY_REGISTRATION_INVITED',
        },
        {
          label: 'Giới thiệu đăng ký công ty mới thành công',
          value: 'SUCCESS_NEW_COMPANY_REGISTRATION_INVITER',
        },
        {
          label: 'Giới thiệu thực hiện đăng ký dịch vụ ứng lương thành công',
          value: 'SUCCESS_REGISTER_SALARY_ADVANCE',
        },
        {
          label: 'Giới thiệu thực hiện ứng lương thành công lần đầu',
          value: 'SUCCESS_FIRST_SALARY_ADVANCE',
        },
        {
          label:
            'Người giới thiệu đạt mốc thưởng (50.000, 100.000, 200.000...)',
          value: 'REACH_MILESTONE',
        },
        {
          label: 'Hạn mức không đủ để trả thưởng cho NGT',
          value: 'REJECTED_BY_EXCEED_BUDGET',
        },
        {
          label: 'Hạn mức chi thưởng của chương trình sắp hết - Admin',
          value: 'ALERT_BUDGET_UNDER_500K_ADMIN',
        },
      ],
    },
    {
      type: 'PROFILE',
      options: [
        {
          label: 'Hồ sơ doanh nghiệp hết hạn ',
          value: 'ALERT_EXPIRING',
        },
      ],
    },
    {
      type: 'ACCOUNTING',
      options: [
        {
          label: 'Beam cập nhật công nợ',
          value: 'ALERT_BEAM_UPLOAD',
        },
      ],
    },
    {
      type: 'RECONCILIATION',
      options: [
        {
          label: 'HR doanh nghiệp cập nhật báo cáo đối soát chốt PDF',
          value: 'ALERT_HRADMIN_UPLOAD_FINAL_PDF',
        },
        {
          label: 'HR doanh nghiệp cập nhật báo cáo đối soát chốt',
          value: 'ALERT_HRADMIN_UPLOAD_FINAL',
        },
        {
          label: 'HR doanh nghiệp cập nhật báo cáo đối soát',
          value: 'ALERT_HRADMIN_UPLOAD',
        },
        {
          label: 'HR doanh nghiệp cập nhật báo cáo đối soát qua Email',
          value: 'ALERT_HRADMIN_UPLOAD_FINAL_BY_EMAIL',
        },
        {
          label: 'Beam cập nhật báo cáo đối soát chốt',
          value: 'ALERT_BEAM_UPLOAD_FINAL',
        },
        {
          label: 'Beam cập nhật báo cáo đối soát gốc',
          value: 'ALERT_BEAM_UPLOAD_ORIGIN',
        },
        {
          label: 'Beam cập nhật báo cáo đối soát chốt PDF',
          value: 'ALERT_BEAM_UPLOAD_FINAL_PDF',
        },
        {
          label: 'Beam cập nhật báo cáo đối soát',
          value: 'ALERT_BEAM_UPLOAD',
        },
      ],
    },
    {
      type: 'VALIDATE_EMPLOYEE_INFORMATION',
      options: [
        {
          label: 'Thông báo cho Beam admin khi NLĐ trùng CCCD',
          value: 'BEAM_ADMIN_DUPLICATE_IDENTITY_NUMBER',
        },
        {
          label: 'Thông báo cho Beam admin khi NLĐ trùng SĐT',
          value: 'BEAM_ADMIN_DUPLICATE_PHONE_NUMBER',
        },
        {
          label: 'Thông báo cho Beam admin khi NLĐ trùng SĐT và CCCD',
          value: 'BEAM_ADMIN_DUPLICATE_IDENTITY_NUMBER_AND_PHONE_NUMBER',
        },
        {
          label: 'Thông báo cho HR admin của doanh nghiệp khi NLĐ trùng CCCD',
          value: 'HR_ADMIN_DUPLICATE_IDENTITY_NUMBER',
        },
        {
          label: 'Thông báo cho HR admin của doanh nghiệp khi NLĐ trùng SĐT',
          value: 'HR_ADMIN_DUPLICATE_PHONE_NUMBER',
        },
        {
          label:
            'Thông báo cho HR admin của doanh nghiệp khi NLĐ trùng SĐT và CCCD',
          value: 'HR_ADMIN_DUPLICATE_IDENTITY_NUMBER_AND_PHONE_NUMBER',
        },
      ],
    },
    {
      type: 'LUCKY_BOX_REWARD',
      options: [
        {
          label: 'Thẻ điện thoại',
          value: 'PHONE_CARD',
        },
        {
          label: 'Voucher mua sắm Shopee',
          value: 'SHOPPING_CARD',
        },
        {
          label: 'Tiền mặt (Chuyển khoản)',
          value: 'CASH',
        },
      ],
    },
  ];
  const getOptions = () => {
    const option = objsList.find((x: any) => x.type == type);
    if (!option) return [];
    return option.options;
  };
  return (
    <Select
      ref={ref}
      // filter={FunctionBase.customSelectFilterOption}
      value={value}
      defaultValue={0}
      optionList={getOptions()}
      placeholder="Chọn loại thông báo"
      onChange={(e: any) => onChange(e)}
      multiple={multiple}
      disabled={disabled}
      showClear
      className={className}
    />
  );
});
NotificationSubTypeSelect.displayName = 'NotificationSubTypeSelect';
