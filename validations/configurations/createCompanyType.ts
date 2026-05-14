import yup from '../yupGlobal';
export const CreateCompanyTypeSchema = yup.object({
  value: yup
    .string()
    .trim()
    .required('Vui lòng nhập giá trị')
    .typeError('Vui lòng nhập giá trị'),
});
