import { BankType } from '@modules/companies/form/CreateCompanyAccountForm';
import yup from './yupGlobal';
import { nonUFT8REg, regPhone, regSymbols } from './regex.constants';
const emailRegExp = /^$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const creatAccountCompany = yup.object({
  phoneNumber: yup
    .string()
    .trim()
    .required('Vui lòng nhập số điện thoại')
    .typeError('Vui lòng nhập số điện thoại')
    .matches(nonUFT8REg, {
      message:
        'Số điện thoại không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
      excludeEmptyString: true,
    })
    .matches(regPhone, 'Số điện thoại không hợp lệ'),
  name: yup
    .string()
    .trim()
    .required('Vui lòng nhập tên nhân viên')
    .typeError('Vui lòng nhập tên nhân viên')
    .matches(nonUFT8REg, {
      message:
        'Tên không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
      excludeEmptyString: true,
    })
    .matches(regSymbols, 'Tên không hợp lệ do có chứa ký tự đặc biệt'),
  // .test('is-valid-name', 'Tên không hợp lệ', function (e: any) {
  //   if (e == null || !e || !nonUFT8REg.test(e)) return false;
  //   return true;
  // }),
  email: yup
    .string()
    .trim()
    .matches(nonUFT8REg, {
      message:
        'Email không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
      excludeEmptyString: true,
    })
    .nullable(),
  dob: yup
    .date()
    .transform(function (value, originalValue) {
      if (this.isType(value)) {
        return value;
      }
    })
    .typeError('Vui lòng chọn ngày sinh của nhân viên')
    .required('Vui lòng chọn ngày sinh của nhân viên'),
  bankAccountNumber: yup
    .string()
    .trim()
    .required('Vui lòng nhập số tài khoản ngân hàng')
    .typeError('Vui lòng nhập số tài khoản ngân hàng')
    .matches(nonUFT8REg, {
      message:
        'Số tài khoản ngân hàng không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
      excludeEmptyString: true,
    }),
  position: yup
    .string()
    .trim()
    .required('Vui lòng chọn chức vụ của nhân viên')
    .typeError('Vui lòng chọn chức vụ của nhân viên'),
  autoGenEmployeeCode: yup.boolean(),
  employeeCode: yup
    .string()
    .trim()
    .nullable()
    .when('autoGenEmployeeCode', {
      is: !true,
      then: yup
        .string()
        .trim()
        .required('Vui lòng nhập mã nhân viên')
        .typeError('Vui lòng nhập mã nhân viên')
        .nullable(),
      otherwise: yup
        .string()
        .trim()
        .notRequired()
        .nullable()
        .matches(nonUFT8REg, {
          message:
            'Mã nhân viên không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
          excludeEmptyString: true,
        }),
    }),
  gender: yup
    .string()
    .trim()
    .required('Vui lòng chọn giới tính của nhân viên')
    .typeError('Vui lòng chọn giới tính của nhân viên'),
  bankHolderName: yup
    .string()
    .trim()
    .when('defaultWithName', {
      is: false,
      then: yup
        .string()
        .trim()
        .required('Vui lòng nhập tên chủ tài khoản')
        .typeError('Vui lòng nhập tên chủ tài khoản')
        .nullable(),
      otherwise: yup.string().trim().notRequired().nullable(),
    })
    .matches(nonUFT8REg, {
      message:
        'Tên chủ tài khoản không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
      excludeEmptyString: true,
    }),
  bankCode: yup
    .string()
    .trim()
    .required('Vui lòng chọn ngân hàng')
    .typeError('Vui lòng chọn ngân hàng'),
  bankBranch: yup
    .string()
    .trim()
    .test(
      'is-valid-bank-branch',
      'Với tài khoản ngân hàng CITAD. Vui lòng chọn chi nhánh!',
      function (e: any) {
        const { bankType } = this.parent;
        if (bankType == BankType.CITAD && (e == null || !e)) return false;
        return true;
      }
    )
    .nullable(),

  salary: yup
    .string()
    .trim()
    .when('payLimitType', (payLimitType, schema) => {
      if (payLimitType == 1)
        return schema
          .required('Vui lòng nhập số tiền lương')
          .typeError('Vui lòng nhập số tiền lương');
      return schema;
    })
    .matches(nonUFT8REg, {
      message:
        'Số tiền lương không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
      excludeEmptyString: true,
    })
    .nullable(),

  payLimitValue: yup
    .string()
    .trim()
    .when('payLimitType', (payLimitType, schema) => {
      if (payLimitType == 0)
        return schema
          .required('Vui lòng nhập hạn mức')
          .typeError('Vui lòng nhập hạn mức');
      return schema;
    })
    .matches(nonUFT8REg, {
      message:
        'Hạn mức cố định không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
      excludeEmptyString: true,
    })
    .nullable(),
  // payLimitSalary: yup
  //   .string()
  //   .test("is-right-salary", "Invalid salary", function () {
  //     const { payLimitType, payLimitSalary } = this.parent;
  //     if (payLimitType == 1 && payLimitSalary != 0) {
  //       return true;
  //     }
  //     if (payLimitType == 0) return true;
  //     return false;
  //   }),
  // salary: yup.number().required('Vui lòng nhập số tiền lương').typeError('Vui lòng nhập số tiền lương'),
  identityNumber: yup
    .string()
    .trim()
    .required('Vui lòng nhập CMT/CCCD/Số hộ chiếu')
    .typeError('Vui lòng nhập CMT/CCCD/Số hộ chiếu')
    .matches(nonUFT8REg, {
      message:
        'CMT/CCCD/Số hộ chiếu không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
      excludeEmptyString: true,
    }),
  // groupIds: yup.array().min(1, 'Vui lòng chọn nhóm').required('Vui lòng chọn nhóm').typeError('Vui lòng chọn nhóm'),
  groupIdPercentage: yup
    .mixed()
    .required('Vui lòng chọn quy tắc ứng')
    .typeError('Vui lòng chọn quy tắc ứng'),

  identificationAddress: yup
    .string()
    .trim()
    .matches(nonUFT8REg, {
      message:
        'Nơi cấp CMT/CCCD/Số hộ chiếu không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
      excludeEmptyString: true,
    })
    .nullable(),
  bankCity: yup
    .string()
    .trim()
    .matches(nonUFT8REg, {
      message:
        'Tỉnh/Thành phố không hợp lệ do có ký tự không mã hoá được. Vui lòng nhập lại dữ liệu bằng tay',
      excludeEmptyString: true,
    })
    .nullable(),
});
