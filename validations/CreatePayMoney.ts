import { requiredText } from './message';
import yup from './yupGlobal';

// Get today's date at 00:00:00
const today = new Date();
today.setHours(0, 0, 0, 0);

export const CreatePayMoney = yup.object({
  companyIds: yup
    .array()
    .min(1, 'Vui lòng chọn công ty áp dụng')
    .required('Vui lòng chọn công ty áp dụng'),
  
  bankCode: yup
    .string()
    .required('Vui lòng chọn nguồn tiền'),

    startAppliedDate: yup
    .date().when('isNew', (val, schema) => {
      if (val === true) {
        return yup
        .date()
        .transform((value, originalValue) => 
          originalValue === "" ? null : value
        )
        .required('Vui lòng chọn thời gian bắt đầu áp dụng').typeError('Vui lòng chọn thời gian bắt đầu áp dụng')
        .min(today, 'Không được phép chọn ngày quá khứ');
      } else {
        return yup.date().nullable().notRequired();
      }
    }), 
  endAppliedDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => 
      originalValue === "" ? null : value
    )
    .min(yup.ref('startAppliedDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
});
