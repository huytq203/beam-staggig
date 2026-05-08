import yup from 'validations/yupGlobal';
import { requiredNumber } from '../CreateCompany.schema';

export const CreateCompanyGroupSchema = yup.object({
  name: yup
    .string()
    .max(100)
    .trim()
    .required('Vui lòng nhập tên nhóm đối tượng'),
  code: yup.string().max(15).trim().required('Vui lòng nhập mã nhóm đối tượng'),
  // payLimitSalary: yup
  //   .number()
  //   .nullable()
  //   .when('payLimitType', (val, schema) => {
  //     if (val === 1) {
  //       return yup
  //         .number()
  //         .min(0, 'Giá trị không hợp lệ')
  //         .transform((_, val) => (val === Number(val) ? val : null))
  //         .typeError(requiredNumber)
  //         .required('Vui lòng nhập hạn mức theo % lương');
  //     } else {
  //       return yup.number().nullable().notRequired();
  //     }
  //   }),
  // description: yup.string().max(500, 'Không được vượt quá 500 ký tự'),
});
