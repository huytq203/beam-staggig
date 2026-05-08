import yup from '../yupGlobal';
export const CreateCampaignTypeSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Vui lòng nhập tên loại chiến dịch')
    .typeError('Vui lòng nhập tên loại chiến dịch'),
});
