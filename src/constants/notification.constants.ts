export const notificationType = [
  {
    label: 'Thông báo cảnh báo',
    value: 'ALERT',
  },
  {
    label: 'Thông báo có điều kiện',
    value: 'CONDITION',
  },
  {
    label: 'Thông báo giao dịch',
    value: 'TRANSACTION',
  },
  {
    label: 'Thông báo hệ thống',
    value: 'SYSTEM',
  },
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
];

export enum NotificationEnum {
  INFORMATION_PENDING = 'INFORMATION_PENDING',
  INFORMATION_ACCEPT = 'INFORMATION_ACCEPT',
  INFORMATION_REJECT = 'INFORMATION_REJECT',
  SALARY_ADVANCE_PENDING = 'SALARY_ADVANCE_PENDING',
  SALARY_ADVANCE_ACCEPT = 'SALARY_ADVANCE_ACCEPT',
  SALARY_ADVANCE_REJECT = 'SALARY_ADVANCE_REJECT',
  TICKET_NEW_COMPANY = 'TICKET_NEW_COMPANY',
  NEW_SALARY_ADVANCE_PENDING_TICKET = 'NEW_SALARY_ADVANCE_PENDING_TICKET',
  FRIEND_INVITATION_ALERT_BUDGET_UNDER_500K_ADMIN = 'FRIEND_INVITATION-ALERT_BUDGET_UNDER_500K_ADMIN',
  PROFILE = 'PROFILE',
  RECONCILIATION = 'RECONCILIATION',
  ACCOUNTING_ALERT_BEAM_UPLOAD = 'ACCOUNTING-ALERT_BEAM_UPLOAD',
  RECONCILIATION_ALERT_FINAL_UPDATE = 'RECONCILIATION_ALERT_FINAL_UPDATE-ALERT_UPDATE',
  RECONCILIATION_ALERT_HRADMIN_UPLOAD_FINAL = 'RECONCILIATION-ALERT_HRADMIN_UPLOAD_FINAL',
  RECONCILIATION_ALERT_HRADMIN_UPLOAD_FINAL_PDF = 'RECONCILIATION-ALERT_HRADMIN_UPLOAD_FINAL_PDF',
  RECONCILIATION_ALERT_HRADMIN_UPLOAD = 'RECONCILIATION-ALERT_HRADMIN_UPLOAD',
  RECONCILIATION_ALERT_BEAM_UPLOAD = 'RECONCILIATION-ALERT_BEAM_UPLOAD',
  RECONCILIATION_ALERT_BEAM_UPLOAD_FINAL = 'RECONCILIATION-ALERT_BEAM_UPLOAD_FINAL',
  RECONCILIATION_ALERT_HRADMIN_UPLOAD_FINAL_BY_EMAIL = 'RECONCILIATION-ALERT_HRADMIN_UPLOAD_FINAL_BY_EMAIL',
  RECONCILIATION_ALERT_BEAM_UPLOAD_ORIGIN = 'RECONCILIATION-ALERT_BEAM_UPLOAD_ORIGIN',
  RECONCILIATION_ALERT_BEAM_UPLOAD_FINAL_PDF = 'RECONCILIATION-ALERT_BEAM_UPLOAD_FINAL_PDF',
  VALIDATE_EMPLOYEE_INFORMATION_BEAM_ADMIN_DUPLICATE_PHONE_NUMBER = 'VALIDATE_EMPLOYEE_INFORMATION-BEAM_ADMIN_DUPLICATE_PHONE_NUMBER',
  VALIDATE_EMPLOYEE_INFORMATION_BEAM_ADMIN_DUPLICATE_IDENTITY_NUMBER_AND_PHONE_NUMBER = 'VALIDATE_EMPLOYEE_INFORMATION-BEAM_ADMIN_DUPLICATE_IDENTITY_NUMBER_AND_PHONE_NUMBER',
  VALIDATE_EMPLOYEE_INFORMATION_HR_ADMIN_DUPLICATE_PHONE_NUMBER = 'VALIDATE_EMPLOYEE_INFORMATION-HR_ADMIN_DUPLICATE_PHONE_NUMBER',
  VALIDATE_EMPLOYEE_INFORMATION_HR_ADMIN_DUPLICATE_IDENTITY_NUMBER_AND_PHONE_NUMBER = 'VALIDATE_EMPLOYEE_INFORMATION-HR_ADMIN_DUPLICATE_IDENTITY_NUMBER_AND_PHONE_NUMBER',
  VALIDATE_EMPLOYEE_INFORMATION_BEAM_ADMIN_DUPLICATE_IDENTITY_NUMBER = 'VALIDATE_EMPLOYEE_INFORMATION-BEAM_ADMIN_DUPLICATE_IDENTITY_NUMBER',
  ALERT_EMPLOYEE_OF_INTEGRATION_COMPANY_INSUFFICIENT_PAY_LIMIT = 'ALERT-EMPLOYEE_OF_INTEGRATION_COMPANY_INSUFFICIENT_PAY_LIMIT',
  ALERT_EMPLOYEE_OF_DEFAULT_COMPANY_INSUFFICIENT_PAY_LIMIT = 'ALERT-EMPLOYEE_OF_DEFAULT_COMPANY_INSUFFICIENT_PAY_LIMIT',
  ALERT_EXPIRING_FEE_POLICY = 'ALERT-EXPIRING_FEE_POLICY',
}

export const notificationSubType = [
  {
    label: 'Hạn mức doanh nghiệp chạm ngưỡng',
    value: 'EXCEED',
  },
  {
    label: 'Hết hạn mức doanh nghiệp',
    value: 'OUT_OF',
  },
  {
    label: 'Hạn mức beam chạm ngưỡng',
    value: 'BEAM_EXCEED',
  },
  {
    label: 'Hết hạn mức beam',
    value: 'BEAM_OUT_OF',
  },
  {
    label: 'Hết hạn mức ngày của beam',
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
  {
    label: 'Tạm khóa ứng lương',
    value: 'TEMP_BLOCK_SALARY_ADVANCE',
  },
  {
    label: 'Hết hạn hợp đồng',
    value: 'CONTRACT_EXPIRED',
  },
  {
    label: 'Thay đổi quy tắc ứng',
    value: 'RULE_CHANGE',
  },
  {
    label: 'Hết hạn hồ sơ',
    value: 'PROFILE_EXPIRED',
  },
  {
    label: 'Thay đổi hạn mức',
    value: 'PAYLIMIT_CHANGE',
  },
  {
    label: 'Đối soát kì lương',
    value: 'FOR_CONTROL_SALARY_PERIOD',
  },
  {
    label: 'Đến hạn thanh toán',
    value: 'PAY_LAST_DAY',
  },
  {
    label: 'Mở khóa lương',
    value: 'OPEN_SALARY_ADVANCE',
  },
  {
    label: 'Khóa ứng lương',
    value: 'BLOCK_SALARY_ADVANCE',
  },
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
  {
    label: 'Bảo trì hệ thống',
    value: 'MAINTAIN_WEB',
  },
  {
    label: 'Bảo trì hệ thống',
    value: 'MAINTAIN_MOBILE',
  },
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
    label: 'Yêu cầu tra soát không thành công',
    value: 'INVEST_REJECT',
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
  {
    label: 'Hạn mức chi thưởng của chương trình sắp hết',
    value: 'ALERT_BUDGET_UNDER_500K',
  },
  {
    label: 'NLĐ đăng ký tham gia chương trình giới thiệu bạn bè thành công',
    value: 'SUCCESS_REGISTRATION',
  },
  {
    label: 'Người được giới thiệu thực hiện đăng ký công ty mới thành công',
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
    label: 'Người giới thiệu đạt mốc thưởng (50.000, 100.000, 200.000...)',
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
  {
    label: 'Hồ sơ doanh nghiệp hết hạn ',
    value: 'ALERT_EXPIRING',
  },
  {
    label: 'Beam cập nhật công nợ',
    value: 'ALERT_BEAM_UPLOAD',
  },
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
    label: 'Thông báo cho HR admin của doanh nghiệp khi NLĐ trùng SĐT và CCCD',
    value: 'HR_ADMIN_DUPLICATE_IDENTITY_NUMBER_AND_PHONE_NUMBER',
  },
  {
    label: 'Thông báo NLĐ bị đánh dấu Nghỉ việc',
    value: 'DISABLE_EMPLOYEE',
  },
  {
    label: 'Thông báo thông tin NLĐ được thay đổi',
    value: 'EMPLOYEE_CHANGE_INFORMATION',
  },
  {
    label: 'Thông báo số điện thoại NLĐ được thay đổi',
    value: 'EMPLOYEE_CHANGE_PHONE_NUMBER',
  },
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
];
