import { requiredText } from './message';
import yup from './yupGlobal';
export const CreateTermFom = yup.object({
  name: yup.string().trim().max(200, 'Không nhập quá 200 ký tự').required('Vui lòng nhập tên biểu mẫu'),
  content: yup.string().trim().required('Vui lòng nhập nội dung biểu mẫu')
});
