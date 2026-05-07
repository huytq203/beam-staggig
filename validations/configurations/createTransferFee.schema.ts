import yup from '../yupGlobal';
export const CreateTransferFeeSchema = yup.object({
  // channel: 0,
  // feeType: 0,
  coefficient: yup
    .number()
    .typeError('Vui lòng nhập hệ số thu phí')
    .required('Vui lòng nhập hệ số thu phí')
    .min(0, 'Vui lòng nhập hệ số thu phí lớn hơn 0'),
  // startTime: yup.string().required('Vui lòng chọn ngày bắt đầu'),
  fixedValue: yup
    .number()
    .nullable()
    .typeError('Vui lòng nhập phí chuyểnn tiền')
    .required('Vui lòng nhập phí chuyển tiền')
    .min(0, 'Vui lòng nhập phí chuyển tiền lớn hơn 0'),
  // status: 0,
  name: yup.string().trim().required('Vui lòng nhập tên kênh chuyển tiền'),
});
