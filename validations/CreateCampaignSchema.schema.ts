import { requiredText } from './message';
import { nonUFT8REg } from './regex.constants';
import yup from './yupGlobal';
export const CreateCampaignSchema = yup.object({
  name: yup
    .string()
    .trim()
    .max(100)
    .required('Vui lòng nhập tên chiến dịch')
    .matches(nonUFT8REg, 'Tên chiến dịch không hợp lệ, vui lòng nhập thủ công'),
  code: yup
    .string()
    .trim()
    .max(50)
    .typeError('Vui lòng nhập mã chiến dịch')
    .required('Vui lòng nhập mã chiến dịch')
    .matches(nonUFT8REg, 'Mã chiến dịch không hợp lệ, vui lòng nhập thủ công'),
  description: yup
    .string()
    .trim()
    .max(3000)
    .required('Vui lòng mô tả nội dung chiến dịch')
    .matches(
      nonUFT8REg,
      'Mô tả chiến dịch không hợp lệ, vui lòng nhập thủ công'
    ),
  quantity: yup
    .number()
    .required('Vui lòng nhập số lượng lớn hơn 0')
    .test(
      'Is positive?',
      'Vui lòng nhập số lượng lớn hơn 0',
      (value) => value === undefined || value === null || value > 0
    )
    .typeError('Vui lòng nhập số lượng lớn hơn 0'),
  value: yup
    .number()
    .typeError('Vui lòng nhập giá trị số lớn hơn 0')
    .required('Vui lòng nhập giá trị số lớn hơn 0'),
  campaignTypeId: yup.string().required('Vui lòng chọn loại chiến dịch'),
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
        return yup.mixed().nullable().notRequired();
      }
    }),
  // companyEmployeeId: yup.string().nullable().required('Vui lòng chọn doanh nghiệp'),
  companyEmployeeId: yup
    .string()
    .nullable()
    .when('applyType', (val, schema) => {
      if (val === 0) {
        return yup
          .string()
          .min(0, 'Giá trị không hợp lệ')
          .transform((_, val) => (val === String(val) ? val : null))
          .typeError('Vui lòng chọn doanh nghiệp')
          .required('Vui lòng chọn doanh nghiệp');
      } else {
        return yup.string().nullable().notRequired();
      }
    }),
  startTime: yup
    .date()
    .required('Vui lòng nhập ngày bắt đầu chiến dịch')
    .typeError('Vui lòng nhập ngày bắt đầu chiến dịch'),
});
