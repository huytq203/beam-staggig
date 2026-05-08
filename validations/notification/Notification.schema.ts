import yup from 'validations/yupGlobal';

export const CreateNotification = yup.object({
  type: yup.string().trim().required('Vui lòng chọn nhóm thông báo'),
  subType: yup.string().trim().required('Vui lòng loại nhóm thông báo'),
  title: yup.string().trim().required('Vui lòng nhập tiêu đề thông báo'),
  content: yup.string().trim().required('Vui lòng nhập chi tiết thông báo'),
  resendType: yup
    .string()
    .trim()
    .required('Vui lòng chọn loại gửi lại')
    .typeError('Vui lòng chọn loại gửi lại'),
});

export const CreateScheduleNotification = yup.object({
  type: yup
    .string()
    .trim()
    .required('Vui lòng chọn loại thông báo')
    .typeError('Vui lòng chọn loại thông báo'),
  title: yup
    .string()
    .max(100, 'Vui lòng không nhập quá 100 ký tự')
    .trim()
    .required('Vui lòng nhập tiêu đề thông báo')
    .typeError('Vui lòng nhập tiêu đề thông báo'),
  content: yup
    .string()
    .max(500, 'Vui lòng không nhập quá 500 ký tự')
    .trim()
    .required('Vui lòng nhập nội dung thông báo')
    .typeError('Vui lòng nhập nội dung thông báo'),
  sendTime: yup
    .date()
    .transform(function (value, originalValue) {
      if (this.isType(value)) {
        return value;
      }
    })
    .typeError('Vui lòng chọn thời gian gửi')
    .required('Vui lòng chọn thời gian gửi'),
  isAllCompany: yup.boolean(),
  companyId: yup
    .array()
    .test('is-valid-company', 'Vui lòng chọn doanh nghiệp', function (e: any) {
      const { isAllCompany, receiver } = this.parent;
      if (
        isAllCompany == false &&
        (receiver == 'user' || receiver == 'hr_admin') &&
        e.length == 0
      )
        return false;
      return true;
    })
    .nullable(),
  isAllEmployee: yup.boolean(),
  customEmployee: yup
    .array()
    .test(
      'is-valid-employee',
      'Vui lòng chọn người lao động',
      function (e: any) {
        const { isAllEmployee, receiver } = this.parent;
        if (
          isAllEmployee == false &&
          (receiver == 'user' || receiver == 'hr_admin') &&
          e.length == 0
        )
          return false;
        return true;
      }
    )
    .nullable(),
  idTypeNotification: yup
    .string()
    .when('type', (type, schema) => {
      if (type == 'CUS_PROMOTION')
        return schema
          .required('Vui lòng chọn mã chiến dịch')
          .typeError('Vui lòng chọn mã chiến dịch');
      return schema;
    })
    .nullable(),
  receiver: yup
    .string()
    .trim()
    .required('Vui lòng chọn người nhận thông báo')
    .typeError('Vui lòng chọn người nhận thông báo'),

  resendType: yup
    .string()
    .trim()
    .required('Vui lòng chọn loại gửi lại')
    .typeError('Vui lòng chọn loại gửi lại'),
  attachUrl: yup
    .string()
    .matches(
      /^https?:\/\/.+$/,
      'Vui lòng nhập đường dẫn hợp lệ bắt đầu bằng http/https'
    )
    .trim()
    .transform((value, originalValue) =>
      originalValue.trim() === '' ? null : value
    )
    .nullable()
    .notRequired(),
});
