import yup from 'validations/yupGlobal';
const phoneRegExp =
  /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b|(02[0-9]{1,2})+([0-9]{8})\b/;
const numberRegExp = /^[0-9]*$/;
export const requiredNumber = 'Trường yêu cầu giá trị số';
const requiredText = 'Trường bắt buộc không được để trống';
const accountNameRegExp = /^((?:[A-Za-z]+ ?){1,3})$/;
const emailExp = /^$|^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const CreateCompanySchema = yup.object({
  taxIdentificationNumber: yup
    .string()
    .trim()
    .required('Vui lòng nhập mã số thuế')
    .typeError('Vui lòng nhập mã số thuế'),
  name: yup.string().trim().required(requiredText),
  shortName: yup.string().trim().required(requiredText),
  email: yup
    .string()
    .trim()
    .required('Vui lòng nhập email')
    .matches(emailExp, 'Vui lòng nhập email đúng định dạng'),
  phoneNumber: yup
    .string()
    .trim()
    .required('Vui lòng nhập số điện thoại')
    .matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
  address: yup.string().trim().required(requiredText),
  maximumDiscount: yup
    .number()
    .nullable()
    .when('valueType', (val, schema) => {
      if (val === 1) {
        return yup
          .number()
          .nullable()
          .typeError('Vui lòng nhập số tiền giảm tối đa')
          .required('Vui lòng nhập số tiền giảm tối đa');
      } else {
        return yup.number().nullable().notRequired();
      }
    }),
  creditLimit: yup.number().when('workDayType', (val, schema) => {
    if (val !== 'FIXED_WORKDAY') {
      return yup
        .number()
        .typeError('Vui lòng nhập tổng hạn mức tối đa')
        .required('Vui lòng nhập tổng hạn mức tối đa')
        .min(0, 'Giá trị không hợp lệ')
        .max(10000000000,'Tổng hạn mức không được vượt quá 10 tỷ')
    } else {
      return yup.mixed().nullable().notRequired();
    }
  }),
  companyPayRate: yup.number().when('workDayType', (val, schema) => {
    if (val !== 'FIXED_WORKDAY') {
      return yup
        .number()
        .typeError('Vui lòng nhập tỉ lệ ứng thực tế')
        .required('Vui lòng nhập tỉ lệ ứng thực tế')
        .min(0, 'Giá trị không hợp lệ');
    } else {
      return yup.mixed().nullable().notRequired();
    }
  }),
  maxCreditLimitPerPeriod: yup.number().when('workDayType', (val, schema) => {
    if (val === 'FIXED_WORKDAY') {
      return yup
        .number()
        .typeError(
          'Vui lòng nhập hạn mức tối đa doanh nghiệp được ứng trong 1 kỳ công'
        )
        .required(
          'Vui lòng nhập hạn mức tối đa doanh nghiệp được ứng trong 1 kỳ công'
        )
        .min(0, 'Giá trị không hợp lệ');
    } else {
      return yup.mixed().nullable().notRequired();
    }
  }),
  maxPayLimitValuePerEmployee: yup
    .number()
    .nullable()
    .notRequired()
    .typeError('Giá trị không hợp lệ')
    .test(
      'less-than-credit-limit',
      'Hạn mức tối đa trên người lao động phải nhỏ hơn tổng hạn mức tối đa',
      function (value) {
        const { creditLimit } = this.parent;
        // Bỏ qua khi chưa nhập giá trị, hoặc khi creditLimit không áp dụng
        if (value === undefined || value === null) return true;
        if (
          creditLimit === undefined ||
          creditLimit === null ||
          (creditLimit as any) === ''
        )
          return true;
        return value < Number(creditLimit);
      }
    ),
  // bankHolderName: yup.string().trim().required(requiredText),
  // bankAccountNumber: yup
  //   .string()
  //   .trim()
  //   .required(requiredText)
  //   .matches(numberRegExp, 'Trường giá trị không hợp lệ'),
  // bankName: yup.string().trim().required(requiredText),
  companyRepresentativeName: yup.string().trim().required(requiredText),
  companyRepresentativeRole: yup.string().trim().required(requiredText),
  // taxIdentificationNumber: yup
  //   .string()
  //   .typeError(requiredNumber)
  //   .required(requiredText)
  //   .matches(numberRegExp, 'Trường yêu cầu giá trị số'),
  gracePeriod: yup
    .string()
    .typeError('Vui lòng nhập ngày ân hạn')
    .required('Vui lòng nhập ngày ân hạn')
    .matches(numberRegExp, 'Trường yêu cầu giá trị số'),
  workDayType: yup
    .string()
    .trim()
    .required('Vui lòng chọn nhóm doanh nghiệp')
    .typeError('Vui lòng chọn nhóm doanh nghiệp'),
});

export const BlockSalaryCompany = yup.object({
  reason: yup
    .string()
    .trim()
    .required('Vui lòng nhập lí do tạm khoá')
    .typeError('Vui lòng nhập lí do tạm khoá'),
  blockDateTimeRange: yup
    .array()
    .test(
      'is-valid-start-date',
      'Vui lòng chọn thời gian tạm khoá dịch vụ ứng lương',
      function (e: any) {
        if (!e[0]) return false;
        return true;
      }
    ),
});
