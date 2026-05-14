import yup from 'validations/yupGlobal';

export const CreateFeePolicySchema = yup.object({
  feeType: yup.number().min(0).max(1).required(),
  name: yup.string().trim().required('Vui lòng nhập tên Chính sách phí'),
  // feeSharingType: yup
  //   .number()
  //   .min(0)
  //   .max(1)
  //   .required("Vui lòng nhập tỉ lệ chia sẻ phí"),
  feeSharingValue: yup
    .number()
    .typeError('Vui lòng nhập giá trị số lớn hơn 0')
    .required('Vui lòng nhập giá trị số lớn hơn 0'),
  upperFeeLimit: (yup.mixed() as any).nullable().applyLowerUpperFee(),
  lowerFeeLimit: (yup.mixed() as any).nullable().applyLowerUpperFee(),
  rangeList: yup
    .mixed()
    .required('Thời điểm trả lương là trường bắt buộc')
    .test(
      'is-right-rangeList-size',
      'Cần nhập ít nhất 2 giá trị khoảng tiền',
      function (rangeList) {
        const { feeType } = this.parent;
        let isValid = true;

        if (feeType == 1 && rangeList.length < 2) {
          isValid = false;
        }
        return isValid;
      }
    )
    .test(
      'is-right-rangeList',
      'Giá trị trong khoảng không hợp lệ',
      function (rangeList) {
        let isValid = true;

        for (let i = 1; i < rangeList.length; i++) {
          if (rangeList[i].from <= rangeList[i - 1].from) {
            isValid = false;
            break;
          }
        }
        return isValid;
      }
    ),
});
