export const feeTypeOptions = [
  {
    value: 0,
    label: 'VNĐ',
  },
  {
    value: 1,
    label: '%',
  },
];

export const simpleStatusOptions = [
  {
    label: 'Hoạt động',
    value: 0,
  },
  {
    label: 'Không hoạt động',
    value: 1,
  },
];

export const statusOptionsWithDraf = [
  {
    label: 'Hoạt động',
    value: 0,
  },
  {
    label: 'Không hoạt động',
    value: 1,
  },
  {
    label: 'Lưu nháp',
    value: 2,
  },
];

export const filterTimeOptions = [
  {
    label: 'Mới nhất',
    value: 1,
  },
  {
    label: 'Cũ nhất',
    value: 0,
  },
];

export const listSortStatusWDraf = [
  { value: 5, label: 'Tất cả' },
  { value: 0, label: 'Hoạt động' },
  { value: 1, label: 'Không hoạt động' },
  { value: 2, label: 'Bản nháp' },
  { value: 3, label: 'Hết hạn' },
];

export const listSortStatus = [
  { value: 3, label: 'Tất cả' },
  { value: 0, label: 'Hoạt động' },
  { value: 1, label: 'Không hoạt động' },
];
export const listSortStatusBoolean = [
  { value: '', label: 'Trạng thái' },
  { value: 'true', label: 'Hoạt động' },
  { value: 'false', label: 'Không hoạt động' },
];

export const listSortType = [
  { value: 'desc', label: 'Mới nhất' },
  { value: 'asc', label: 'Cũ nhất' },
];

export const dateRegisterUser = [
  { value: 3, label: 'Chọn ngày' },
  { value: 0, label: 'Ngày tạo' },
  { value: 1, label: 'Ngày đăng ký ứng lương' },
  { value: 2, label: 'Ngày xác nhận thông tin' },
];

export const listTermStatus = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'ACTIVE', label: 'Phát hành' },
  { value: 'DRAFT', label: 'Lưu nháp' },
];
export const listTermOfContractStatus = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'ON', label: 'Hoạt động' },
  { value: 'OFF', label: 'Không hoạt động' },
];
export const listStatusTransaction = [
  { value: '', label: 'Tất cả' },
  { value: 'SUCCESS', label: 'Thành công' },
  { value: 'FAIL', label: 'Thất bại' },
  { value: 'PENDING', label: 'Đang xử lý' },
  { value: 'REFUND', label: 'Hoàn trả' },
];

export const notificationEstablishType = [
  { value: 'CUS_TICKET', label: 'Thông báo yêu cầu' },
  { value: 'CUS_SYSTEM', label: 'Thông báo hệ thống' },
  { value: 'CUS_CUSTOMER_CARE', label: 'Thông báo CSKH' },
  { value: 'CUS_ALERT', label: 'Thông báo Cảnh báo' },
  {
    value: 'CUS_TRANSACTION',
    label: 'Thông báo giao dịch',
  },
  { value: 'CUS_CONDITION', label: 'Thông báo điều kiện' },
  { value: 'CUS_PROMOTION', label: 'Thông báo chiến dịch' },
];

export const listReceiver = [
  { value: 'beam_admin', label: 'Beam Admin' },
  { value: 'accountant', label: 'Kế toán viên' },
  { value: 'reconciler', label: 'Đối soát viên' },
  { value: 'controller', label: 'Kiểm soát viên' },
  { value: 'sale', label: 'Cán bộ kinh doanh' },
  { value: 'hr_admin', label: 'HR Admin' },
  { value: 'cs', label: 'Dịch vụ khách hàng' },
  { value: 'user', label: 'Người lao động' },
];

export const listResendType = [
  { value: 0, label: 'Không gửi lại' },
  { value: 1, label: 'Các ngày làm việc' },
  { value: 2, label: 'Hàng ngày' },
  { value: 3, label: 'Hàng tuần' },
  { value: 4, label: 'Hàng tháng' },
];

export const listTypeTimes = [
  { value: '', label: 'Tất cả' },
  { value: 'SEND_TIME', label: 'Ngày gửi' },
  { value: 'CREATED_AT', label: 'Ngày tạo' },
  { value: 'UPDATED_AT', label: 'Ngày cập nhật' },
];
export const listTranferTransaction = [
  { value: '', label: 'Tất cả' },
  { value: 1, label: 'CITAD' },
  { value: 0, label: 'NAPAS' },
];

export const listSenderBank = [
  { value: '', label: 'Tất cả' },
  { value: 'VPBANK', label: 'VPBANK' },
  { value: 'PVCOMBANK', label: 'PVCOMBANK' },
  { value: 'VIETCOMBANK', label: 'VIETCOMBANK' },
];

export const customerClassification = [
  {
    value: '',
    label: 'Tất cả',
  },
  {
    value: 2,
    label: 'Khách hàng thân thiết',
  },
  {
    value: 3,
    label: 'Khách hàng tiềm năng',
  },
  {
    value: 0,
    label: 'Khách hàng có hạn mức lớn (Chưa đăng ký DVUL)',
  },
  {
    value: 1,
    label: 'Khách hàng có hạn mức thấp (Chưa đăng ký DVUL)',
  },
];

export const payPolicyOptions = [
  {
    value: 0,
    label: 'Kỳ lương tháng trước',
  },
  {
    value: 1,
    label: 'Kỳ lương tháng hiện tại',
  },
  {
    value: 2,
    label: 'Kỳ lương tháng sau',
  },
];
export const listStatusPayMoney = [
  { value: '', label: 'Tất cả' },
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'EXPIRED', label: 'Hết hạn' },
  { value: 'INACTIVE', label: 'Không hoạt động' },
];

export const listBankcode = [
  { value: 'VPBANK', label: 'VPBank' },
  { value: 'PVCOMBANK', label: 'PVcomBank' },
  { value: 'VIETCOMBANK', label: 'VietcomBank' },
];

export const listStatusPayMoneySetup = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Không hoạt động' },
];
export const listStatusCampaign = [
  { value: '', label: 'Tất cả' },
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'EXPIRED', label: 'Hết hạn' },
  { value: 'INACTIVE', label: 'Không hoạt động' },
  { value: 'DRAFT', label: 'Bản nháp' },
];

export const listeligibleParticipant = [
  {
    value: 'ALL',
    label: 'Tất cả',
  },
  {
    value: 'COMMON',
    label: 'Hộp thường',
  },
  {
    value: 'GOLDEN',
    label: 'Hộp vàng',
  },
];

export const listTypeOfGiftBudget = [
  {
    value: 'COMMON',
    label: 'Hộp thường',
  },
  {
    value: 'GOLDEN',
    label: 'Hộp vàng',
  },
];

export const listChallengeType = [
  {
    value: 'SALARY_ADVANCE',
    label: 'Ứng lương',
  },
  {
    value: 'REGISTER_SALARY_ADVANCE',
    label: 'Đăng ký ứng lương',
  },
  {
    value: 'CHECK_IN',
    label: 'Check-in app',
  },
  {
    value: 'FRIEND_INVITATION',
    label: 'Giới thiệu bạn bè',
  },
];

export const listRewardType = [
  {
    value: '',
    label: 'Tất cả',
  },
  {
    value: 'FLEXPAY_VOUCHER',
    label: 'Voucher giảm giá Flexpay',
  },
  {
    value: 'CASH',
    label: 'Tiền mặt',
  },
  {
    value: 'SHOPEE_VOUCHER',
    label: 'Voucher giảm giá Shopee',
  },
  {
    value: 'PHONE_CREDIT',
    label: 'Thẻ điện thoại',
  },
  {
    value: 'MEDAL',
    label: 'Huy chương',
  },
  {
    value: 'COMMON_LUCKY_BOX',
    label: 'Hộp quà thường',
  },
  {
    value: 'GOLDEN_LUCKY_BOX',
    label: 'Hộp quà vàng',
  },
];

export const listRewardStatus = [
  {
    value: '',
    label: 'Tất cả',
  },
  {
    value: 'PAID',
    label: 'Đã chi thưởng',
  },
  {
    value: 'NOT_PAID',
    label: 'Chưa chi thưởng',
  },
  {
    value: 'CANCELED_REWARD',
    label: 'Huỷ chi thưởng',
  },
];

export const listStatusBoolean = [
  { value: '', label: 'Tất cả' },
  { value: 'true', label: 'Hoạt động' },
  { value: 'false', label: 'Không hoạt động' },
]