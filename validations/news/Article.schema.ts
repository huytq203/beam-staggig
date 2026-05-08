import { requiredText } from "../message";
import yup from "../yupGlobal";
export const CreateArticleSchema = yup.object({
  title: yup
    .string()
    .typeError(requiredText)
    .required("Vui lòng nhập tiêu đề bài viết"),
  slug: yup
    .string()
    .typeError(requiredText)
    .required("Vui lòng nhập url bài viết"),
  coverImage: yup
    .string()
    .typeError(requiredText)
    .required("Vui lòng chọn ảnh bài viết"),
  description: yup
    .string()
    .typeError(requiredText)
    .required("Vui lòng nhập mô tả ngắn"),
});
