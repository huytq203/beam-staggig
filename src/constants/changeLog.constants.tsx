import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { COMMON_FORMAT } from './common-format';
import { ArrayHelper } from '@helpers/array.helper';

enum CONTRACT_EXPIRED {
  CONTRACT_EXPIRED = 'Hết hạn hợp đồng',
}
const checkValidCurrency = (data: number) => {
  return Number.isInteger(data) ? StringHelper.formatVND(data) : '';
};

enum ROLE {
  SUPER_ADMIN = 'Super Admin',
  BEAM_ADMIN = 'Beam Admin',
  HR_ADMIN = 'HR Admin',
  RECONCILER = 'Đối soát viên',
  ACCOUNTANT = 'Kế toán viên',
  CONTROLLER = 'Kiểm soát viên',
  SALE = 'Cán bộ kinh doanh',
  CS = 'Dịch vụ khách hàng',
}

export const COMMON_FIELD = [
  {
    field: 'bankName',
    text: 'Ngân hàng',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'gender',
    text: 'Giới tính',
    convertData: function (data: any) {
      return data == 0 ? 'Nam' : data == 1 ? 'Nữ' : 'Khác';
    },
  },
  {
    field: 'bankAccountNumber',
    text: 'Số tài khoản',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'bankBranch',
    text: 'Chi nhánh',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'bankCity',
    text: 'Tỉnh/Thành phố ngân hàng',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'bankCode',
    text: 'Tên ngân hàng',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'bankHolderName',
    text: 'Tên chủ tài khoản',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'company',
    text: 'Công ty',
    convertData: function (data: any) {
      return '';
    },
  },
  {
    field: 'companies',
    text: 'Công ty',
    convertData: function (data: any) {
      return data?.companyNames
        .filter((x: any) => x !== null)
        .map((x: any) => {
          return <p>-{x}</p>;
        });
    },
  },
  {
    field: 'eligibleCompanyNames',
    text: 'Công ty chốt đối soát',
    convertData: function (data: any) {
      if (!Array.isArray(data)) return;
      return data
        .filter((x: any) => x !== null)
        .map((x: any) => {
          return <p>-{x}</p>;
        });
    },
  },
  {
    field: 'dob',
    text: 'Ngày sinh',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'email',
    text: 'Email',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'employeeCode',
    text: 'Mã nhân viên',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'enabled',
    text: 'Trạng thái',
    convertData: function (data: any) {
      return data ? 'Hoạt động' : 'Không hoạt động';
    },
  },
  {
    field: 'status',
    text: 'Trạng thái',
    convertData: function (data: any) {
      return data === 0 ? 'Hoạt động' : data === 1 ? 'Không hoạt động' : 'Nháp';
    },
  },
  {
    field: 'groupIdPercentage',
    text: 'Quy tắc ứng',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'groups',
    text: 'Nhóm',
    convertData: function (data: any) {
      return data
        ?.map((group: any) => {
          return group.map((groupName: any) => {
            if (groupName?.name !== undefined) {
              return groupName?.name;
            } else {
              return null;
            }
          });
        })
        .join(', ');
    },
  },
  {
    field: 'identificationAddress',
    text: 'Nơi cấp CMT/CCCD/Hộ chiếu',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'identificationProvideDay',
    text: 'Ngày cấp CMT/CCCD/Hộ chiếu',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'identityNumber',
    text: 'Số CMND/CCCD/Hộ chiếu',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'companySize',
    text: 'Quy mô nhân sự',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'name',
    text: 'Tên',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'payAccountType',
    text: 'Loại tài khoản nhận ứng',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'payLimitSalaryPercentage',
    text: 'Quy tắc ứng tuỳ chỉnh',
    convertData: function (data: any) {
      return data ? `${data}%` : null;
    },
  },
  {
    field: 'payLimitSalaryType',
    text: 'Loại hạn mức ứng',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'payLimitValue',
    text: 'Hạn mức cố định',
    convertData: function (data: any) {
      return checkValidCurrency(data);
    },
  },
  {
    field: 'maxCreditLimitPerPeriod',
    text: 'Hạn mức tối đa doanh nghiệp được ứng trong 1 kỳ công',
    convertData: function (data: any) {
      return checkValidCurrency(data);
    },
  },
  {
    field: 'advancedAmount',
    text: 'Giá trị tạm ứng lương Mùng 1',
    convertData: function (data: any) {
      return checkValidCurrency(data);
    },
  },
  {
    field: 'phoneNumber',
    text: 'Số điện thoại',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'socialInsuranceNumber',
    text: 'Mã BHXH',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'position',
    text: 'Chức vụ',
    convertData: function (data: any) {
      return data == 0 ? 'Nhân viên' : data == 1 ? 'Quản lý' : '';
    },
  },
  {
    field: 'reason',
    text: 'Lý do',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'salary',
    text: 'Lương',
    convertData: function (data: any) {
      return checkValidCurrency(data);
    },
  },
  {
    field: 'startApplyDate',
    text: 'Ngày bắt đầu ứng lương',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'blockEnd',
    text: 'Ngày kết thúc tạm khoá ứng lương công ty',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'blockStart',
    text: 'Ngày bắt đầu tạm khoá ứng lương công ty',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'blockReason',
    text: 'Lý do tạm khoá ứng lương công ty',
    convertData: function (data: any) {
      const expeiredKey = Object.keys(CONTRACT_EXPIRED);
      const expeiredValue = Object.values(CONTRACT_EXPIRED);
      const found = expeiredKey.findIndex((x: any) => x == data);
      return expeiredValue[found] ? expeiredValue[found] : data;
    },
  },
  {
    field: 'registerSalaryAdvance',
    text: 'Trạng thái đăng ký ứng lương',
    convertData: function (data: any) {
      return data
        ? 'Đã đăng ký dịch vụ ứng lương'
        : 'Chưa đăng ký dịch vụ ứng lương';
    },
  },
  {
    field: 'defaultWithName',
    text: 'Mặc định theo họ tên',
    convertData: function (data: any) {
      return data === true ? 'Có' : 'Không';
    },
  },
  {
    field: 'blocked',
    text: 'Khoá ứng lương công ty',
    convertData: function (data: any) {
      return data === true ? 'Có' : 'Không';
    },
  },
  {
    field: 'createdAt',
    text: 'Ngày khởi tạo',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'createdBy',
    text: 'Người khởi tạo',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'updatedAt',
    text: 'Ngày cập nhật',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'updatedBy',
    text: 'Người cập nhật',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'salaryAdvance',
    text: 'Trạng thái ứng lương',
    convertData: function (data: any) {
      return data ? 'Mở khoá ứng lương' : 'Khoá ứng lương';
    },
  },
  {
    field: 'registerSalaryAdvanceTime',
    text: 'Ngày đăng ký ứng lương',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'verifiedInformation',
    text: 'Trạng thái xác nhận thông tin',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'verifiedInformationTime',
    text: 'Ngày xác nhận thông tin',
    convertData: function (data: any) {
      return DateTimeHelper.convertTimeZone(data, COMMON_FORMAT.DATE);
    },
  },
  {
    field: 'gracePeriod',
    text: 'Số ngày ân hạn',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'noExpiredDates',
    text: 'Không thời hạn hợp đồng',
    convertData: function (data: any) {
      return data === true ? 'Có' : 'Không';
    },
  },
  {
    field: 'normalizedName',
    text: 'Tên chuẩn hoá',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'contractExpiredDates',
    text: 'Ngày kết thúc hợp đồng',
    convertData: function (data: any) {
      return data ? data.replace(/@/g, ', ') : data;
    },
  },
  {
    field: 'address',
    text: 'Địa chỉ',
    convertData: function (data: any) {
      return data;
    },
  },
  // {
  //   field: 'bankName',
  //   text: 'Tên ngân hàng',
  //   convertData: function (data: any) {
  //     return data;
  //   },
  // },
  {
    field: 'shortName',
    text: 'Tên viết tắt',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'companyPayRate',
    text: 'Tỉ lệ ứng thực tế',
    convertData: function (data: any) {
      return data ? `${data}%` : '';
    },
  },
  {
    field: 'taxIdentificationNumber',
    text: 'Mã số thuế',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'companyRepresentativeName',
    text: 'Người đại diện công ty',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'companyRepresentativeRole',
    text: 'Chức vụ',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'changeEnableReason',
    text: 'Lý do dừng hoạt động',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'autoGenEmployeeCode',
    text: 'Tự động sinh mã nhân viên',
    convertData: function (data: any) {
      return data === true ? 'Có' : data === false ? 'Không' : '';
    },
  },
  {
    field: 'ticketRegisterSalaryAdvance',
    text: 'Doanh nghiệp phê duyệt đăng ký ứng lương',
    convertData: function (data: any) {
      return data === true ? 'Có' : data === false ? 'Không' : '';
    },
  },
  {
    field: 'ticketChangeInformation',
    text: 'Thay đổi thông tin tài khoản ứng lương',
    convertData: function (data: any) {
      return data === true ? 'Có' : data === false ? 'Không' : '';
    },
  },
  {
    field: 'manageSalaryAdvanceRequest',
    text: 'Doanh nghiệp phê duyệt ứng lương từng lần',
    convertData: function (data: any) {
      return data === true ? 'Có' : data === false ? 'Không' : '';
    },
  },
  {
    field: 'transManageSalaryAdvanceRequest',
    text: 'Doanh nghiệp phê duyệt ứng lương từng lần',
    convertData: function (data: any) {
      return data ? 'Có' : 'Không';
    },
  },
  {
    field: 'employeeInformationChange',
    text: 'HR chỉnh sửa thông tin nhân sự',
    convertData: function (data: any) {
      return data === true ? 'Có' : data === false ? 'Không' : '';
    },
  },
  {
    field: 'requireSocialInsuranceNumber',
    text: 'Mã số BHXH',
    convertData: function (data: any) {
      return data === true ? 'Có' : data === false ? 'Không' : '';
    },
  },
  {
    field: 'workDayType',
    text: 'Nhóm doanh nghiệp',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case 'DEFAULT':
          label = 'Nhóm doanh nghiệp mặc định';
          break;
        case 'UPLOAD_WORKDAY':
          label = 'Doanh nghiệp tải lên ngày công';
          break;
        case 'API_MIGRATION':
          label = 'Doanh nghiệp tích hợp dữ liệu';
          break;
        case 'FIXED_WORKDAY':
          label = 'Doanh nghiệp ứng lương không theo ngày công';
          break;
        case 'PAY_LIMIT_FIXED_DATE':
          label = 'Doanh nghiệp có thời gian tính hạn mức';
          break;
      }
      return label;
    },
  },
  // {
  //   field: 'payLimitSalaryPercentage',
  //   text: 'Quy tắc ứng tuỳ chỉnh',
  //   convertData: function (data: any) {
  //     return data;
  //   },
  // },
  {
    field: 'creditLimit',
    text: 'Tổng hạn mức',
    convertData: function (data: any) {
      return StringHelper.formatVND(data);
    },
  },
  {
    field: 'payLimitType',
    text: 'Chính sách hạn mức ứng',
    convertData: function (data: any) {
      return data == 0 ? 'Cố định' : 'Theo phần trăm';
    },
  },
  {
    field: 'payLimitSalary',
    text: 'Hạn mức ứng',
    convertData: function (data: any) {
      if (data) {
        return `${data}%`;
      }
    },
  },
  {
    field: 'endTime',
    text: 'Thời gian kết thúc',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'startTime',
    text: 'Thời gian bắt đầu',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'note',
    text: 'Ghi chú',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'description',
    text: 'Mô tả',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'lastWorkingDayOfPeriod',
    text: 'Ngày chốt công',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'payDay',
    text: 'Ngày trả lương',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'payForm',
    text: 'Loại hình trả lương',
    convertData: function (data: any) {
      return data === 1
        ? '1 ngày cố định trong tháng'
        : data === 2
        ? '2 ngày cố định trong tháng'
        : '';
    },
  },
  {
    field: 'payPolicy',
    text: 'Kỳ trả lương',
    convertData: function (data: any) {
      return data === 0
        ? 'Kỳ lương tháng trước'
        : data === 1
        ? 'Kỳ lương tháng hiện tại'
        : data === 2
        ? 'Kỳ lương tháng sau'
        : '';
    },
  },
  {
    field: 'workday',
    text: 'Ngày bắt đầu Chu kỳ công',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'payLimitWeekendEnabled',
    text: 'Hạn mức Thứ 7 và CN',
    convertData: function (data: any) {
      return data ? 'Có' : 'Không';
    },
  },
  {
    field: 'payLimitByDateEnabledStartDay',
    text: 'Ngày bắt đầu tính hạn mức',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'payLimitByDateEnabledEndDay',
    text: 'Ngày kết thúc tính hạn mức',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'startSalaryAdvanceDay',
    text: 'Ngày bắt đầu ứng lương',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'endSalaryAdvanceDay',
    text: 'Ngày kết thúc ứng lương',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'uploadEmployeeStartDay',
    text: 'Ngày bắt đầu tải lên danh sách NLĐ',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'uploadEmployeeEndDay',
    text: 'Ngày kết thúc tải lên danh sách NLĐ',
    convertData: function (data: any) {
      return data;
    },
  },
  // {
  //   field: 'feeRangeType',
  //   text: 'Giá trị phí',
  //   convertData: function (data: any) {
  //     return JSON.parse(data);
  //   },
  // },
  // {
  //   field: 'feeValue',
  //   text: 'Giá trị phí',
  //   convertData: function (data: any) {
  //     return JSON.parse(data);
  //   },
  // },
  {
    field: 'feeRangeValueType',
    text: 'Giá trị phí',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'feeRange',
    text: 'Giá trị',
    convertData: function (data: any) {
      return JSON.parse(data);
    },
  },
  {
    field: 'autoApply',
    text: 'Tự động áp dụng chính sách phí mới',
    convertData: function (data: any) {
      return data ? 'Có' : 'Không';
    },
  },
  {
    field: 'feeRangeType',
    text: 'Loại phí',
    convertData: function (data: any) {
      return JSON.parse(data);
    },
  },
  {
    field: 'lowerFeeLimit',
    text: 'Giá trị tối thiểu',
    convertData: function (data: any) {
      return checkValidCurrency(data);
    },
  },
  {
    field: 'upperFeeLimit',
    text: 'Giá trị tối đa',
    convertData: function (data: any) {
      return checkValidCurrency(data);
    },
  },
  {
    field: 'feeSharingValue',
    text: 'Doanh nghiệp chia sẻ phí',
    convertData: function (data: any) {
      return data ? data : 0;
    },
  },
  {
    field: 'applyLowerFeeLimit',
    text: 'Thiết lập giá trị tối thiểu',
    convertData: function (data: any) {
      return data ? 'Có' : 'Không';
    },
  },
  {
    field: 'applyUpperFeeLimit',
    text: 'Thiết lập giá trị tối đa',
    convertData: function (data: any) {
      return data ? 'Có' : 'Không';
    },
  },
  {
    field: 'feeSharingType',
    text: 'Tỉ lệ chia sẻ phí',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case 0:
          label = 'VNĐ';
          break;
        case 1:
          label = '%';
          break;
        case 2:
          label = 'Phí cố định theo %';
          break;
      }
      return <p>{label}</p>;
    },
  },
  {
    field: 'finalLimit',
    text: 'Mức cuối',
    convertData: function (data: any) {
      return data ? 'Có' : 'Không';
    },
  },
  {
    field: 'feeType',
    text: 'Loại chính sách phí',
    convertData: function (data: any) {
      return data == 0 ? 'Phí cố định' : 'Phí theo khoảng rút tiền';
    },
  },
  {
    field: 'feeRange',
    text: 'Khoảng tiền',
    convertData: function (data: any) {
      return data == 0 ? 'Phí cố định' : 'Phí theo khoảng rút tiền';
    },
  },
  {
    field: 'appliedCompanyName',
    text: 'Doanh nghiệp áp dụng',
    convertData: function (data: any) {
      return ArrayHelper.removeEmlementNullOrUndefine(data)?.map((x: any) => (
        <p className="beam-break-world">-{x}</p>
      ));
    },
  },
  {
    field: 'code',
    text: 'Mã chiến dịch',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'campaignTypeId',
    text: 'Loại chiến dịch',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'appliedObjects',
    text: 'Đối tượng áp dụng',
    convertData: function (data: any) {
      return ArrayHelper.removeEmlementNullOrUndefine(data)?.map((x: any) => (
        <p className="beam-break-world">-{x}</p>
      ));
    },
  },
  {
    field: 'ageRange',
    text: 'Độ tuổi',
    convertData: function (data: any) {
      const ageRange = [
        'Tất cả',
        'Dưới 20',
        '20 - 29',
        '30 - 39',
        '40 - 49',
        '50 - 59',
        'Trên 60',
      ];
      return data.split(',').map((x: any) => {
        return <p>{ageRange[x]}</p>;
      });
    },
  },
  {
    field: 'applyAll',
    text: 'Áp dụng cho tất cả',
    convertData: function (data: any) {
      return data ? 'Có' : 'Không';
    },
  },
  {
    field: 'applyNumber',
    text: 'Số lần áp dụng (trên một tài khoản)',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case '0':
          label = '01';
          break;
        case '1':
          label = '02';
          break;
        case '2':
          label = '03';
          break;
        case '3':
          label = 'Không giới hạn';
          break;
      }
      return <p>{label}</p>;
    },
  },
  {
    field: 'applyType',
    text: 'Phạm vi áp dụng',
    convertData: function (data: any) {
      return data == 0
        ? 'Áp dụng cho 1 doanh nghiệp'
        : 'Áp dụng cho nhiều doanh nghiệp';
    },
  },
  {
    field: 'birthMonth',
    text: 'Sinh nhật',
    convertData: function (data: any) {
      const birthMonth = [
        'Tất cả',
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ];

      return data.split(',').map((x: any) => {
        return <p>{birthMonth[x]}</p>;
      });
    },
  },
  {
    field: 'companyApplyName',
    text: 'Công ty áp dụng',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'groupApplyName',
    text: 'Nhóm',
    convertData: function (data: any) {
      return ArrayHelper.removeEmlementNullOrUndefine(data)?.map((x: any) => (
        <p className="beam-break-world">-{x.name}</p>
      ));
    },
  },
  {
    field: 'guide',
    text: 'Cách thức tham gia',
    convertData: function (data: any) {
      return <div dangerouslySetInnerHTML={{ __html: data }}></div>;
    },
  },
  {
    field: 'image',
    text: 'Tên ảnh',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'jobRole',
    text: 'Chức vụ',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case '0':
          label = 'Tất cả';
          break;
        case '1':
          label = 'Nhân viên';
          break;
        case '2':
          label = 'Quản lý';
          break;
      }
      return <p>{label}</p>;
    },
  },
  {
    field: 'maximumDiscount',
    text: 'Giảm tối đa',
    convertData: function (data: any) {
      return checkValidCurrency(data);
    },
  },
  {
    field: 'maximumBudget',
    text: 'Ngân sách chiến dịch',
    convertData: function (data: any) {
      return checkValidCurrency(data);
    },
  },

  {
    field: 'minimumTransfer',
    text: 'Mức giao dịch tối thiểu',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case '0':
          label = '0';
          break;
        case '1':
          label = '100.000 đ';
          break;
        case '2':
          label = '1.000.000 đ';
          break;
        case '3':
          label = '3.000.000 đ';
          break;
        case '4':
          label = '5.000.000 đ';
          break;
      }
      return <p>{label}</p>;
    },
  },
  {
    field: 'multipleApply',
    text: 'Áp dụng đồng thời với các chiến dịch khác',
    convertData: function (data: any) {
      return data ? 'Có' : 'Không';
    },
  },
  {
    field: 'quantity',
    text: 'Số lượng',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'sex',
    text: 'Giới tính',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case '0':
          label = 'Tất cả';
          break;
        case '1':
          label = 'Nam';
          break;
        case '2':
          label = 'Nữ';
          break;
        case '3':
          label = 'Khác';
          break;
      }
      return <p>{label}</p>;
    },
  },
  {
    field: 'quantity',
    text: 'Số lượng',
    convertData: function (data: any) {
      return data;
    },
  },
  // {
  //   field: 'used',
  //   text: 'Số mã đã dùng',
  //   convertData: function (data: any) {
  //     return data;
  //   },
  // },
  {
    field: 'valueCampaign',
    text: 'Giá trị chiến dịch',
    convertData: function (data: any) {
      const value = data.split(':');
      return (
        <p>
          {value[1] == 0 ? StringHelper.formatVND(value[0]) : value[0] + '%'}
        </p>
      );
    },
  },
  {
    field: 'usedAmount',
    text: 'Số tiền đã dùng',
    convertData: function (data: any) {
      return StringHelper.formatVND(data);
    },
  },
  {
    field: 'fullName',
    text: 'Họ tên',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'role',
    text: 'Phân quyền',
    convertData: function (data: any) {
      const roleKey = Object.keys(ROLE);
      const roleValue = Object.values(ROLE);
      const found = roleKey.findIndex((x: any) => x.toLowerCase() == data);
      return roleValue[found];
    },
  },
  {
    field: 'bankCodePM',
    text: 'Nguồn tiền',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case 'VPBANK':
          label = 'VPBank';
          break;
        case 'PVCOMBANK':
          label = 'PVcomBank';
          break;
        case 'VIETCOMBANK':
          label = 'VietcomBank';
          break;
      }
      return <p>{label}</p>;
    },
  },
  {
    field: 'endAppliedDate',
    text: 'Ngày kết thúc',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'statusPM',
    text: 'Trạng thái',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case 'ACTIVE':
          label = 'Hoạt động';
          break;
        case 'INACTIVE':
          label = 'Không hoạt động';
          break;
      }
      return <p>{label}</p>;
    },
  },

  {
    field: 'vpBankStatus',
    text: 'Cấu hình hoạt động VPBank',
    convertData: function (data: any) {
      return data === true ? 'Hoạt động' : 'Không hoạt động';
    },
  },

  {
    field: 'pvComBankStatus',
    text: 'Cấu hình hoạt động PVComBank',
    convertData: function (data: any) {
      return data === true ? 'Hoạt động' : 'Không hoạt động';
    },
  },

  {
    field: 'vietComBankStatus',
    text: 'Cấu hình hoạt động VietComBank',
    convertData: function (data: any) {
      return data === true ? 'Hoạt động' : 'Không hoạt động';
    },
  },

  {
    field: 'bankCodeDefault',
    text: 'Ngân hàng mặc định',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case 'VPBANK':
          label = 'VPBank';
          break;
        case 'PVCOMBANK':
          label = 'PVcomBank';
          break;
        case 'VIETCOMBANK':
          label = 'VietcomBank';
          break;
      }
      return <p>{label}</p>;
    },
  },
  {
    field: 'typeDebt',
    text: 'Loại công nợ',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case 'IN_PERIOD':
          label = 'Công nợ trong kỳ';
          break;
        case 'OVERDUE':
          label = 'Lãi suất quá hạn';
          break;
      }
      return <p>{label}</p>;
    },
  },
  {
    field: 'transferType',
    text: 'Loại giao dịch',
    convertData: function (data: any) {
      let label = '';
      switch (data) {
        case 1:
          label = 'Ghi nợ';
          break;
        case 0:
          label = 'Ghi có';
          break;
      }
      return <p>{label}</p>;
    },
  },
  {
    field: 'moneyAmount',
    text: 'Số tiền',
    convertData: function (data: any) {
      return checkValidCurrency(data);
    },
  },
  {
    field: 'savedDate',
    text: 'Ngày ghi nợ/có',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'expiredDate',
    text: 'Ngày đến hạn',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'descriptionDebt',
    text: 'Ghi chú',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'overdueInterestRate',
    text: 'Lãi suất quá hạn (ngày)',
    convertData: function (data: any) {
      return data ? `${data}%` : null;
    },
  },
  {
    field: 'periodDebt',
    text: 'Kỳ công',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'file',
    text: 'File',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'codeDebt',
    text: 'Mã hoạch toán',
    convertData: function (data: any) {
      return data;
    },
  },
  {
    field: 'companyNameDebt',
    text: 'Tên công ty',
    convertData: function (data: any) {
      return data;
    },
  },
];
