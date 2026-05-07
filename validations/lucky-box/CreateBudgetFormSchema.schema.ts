import yup from '../yupGlobal';

export const CreateBudgetFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Vui lòng chọn tên phần thưởng')
    .typeError('Vui lòng chọn tên phần thưởng'),
  // value: yup
  //   .number()
  //   .required('Vui lòng nhập giá trị')
  //   .typeError('Vui lòng nhập giá trị')
  //   .min(1, 'Vui lòng nhập giá trị lớn hơn 0'),
  sizeCap: yup
    .number()
    .required('Vui lòng nhập số lượng tối đa')
    .typeError('Vui lòng nhập số lượng tối đa')
    .min(1, 'Vui lòng nhập số lượng tối đa lớn hơn 0'),
  amount: yup
    .number()
    .required('Vui lòng nhập số lượng quà của phần thưởng')
    .typeError('Vui lòng nhập số lượng quà của phần thưởng')
    .min(1, 'Vui lòng nhập số lượng quà của phần thưởng lớn hơn 0'),
  size: yup
    .number()
    .required('Vui lòng nhập số lượng cài đặt')
    .typeError('Vui lòng nhập số lượng cài đặt')
    .min(1, 'Vui lòng nhập số lượng cài đặt lớn hơn 0')
    .test(
      'is-valid-size',
      'Vui lòng nhập số lượng cài đặt nhỏ hơn hoặc bằng số lượng tối đa!',
      function (e: any) {
        const { sizeCap } = this.parent;
        if (sizeCap < e) return false;
        return true;
      }
    ),
  type: yup
    .string()
    .trim()
    .required('Vui lòng chọn loại quà')
    .typeError('Vui lòng chọn loại quà'),
  eligibleParticipant: yup
    .string()
    .trim()
    .required('Vui lòng chọn Đối tượng nhận thưởng')
    .typeError('Vui lòng chọn Đối tượng nhận thưởng'),
});
