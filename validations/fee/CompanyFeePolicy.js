import yup from 'validations/yupGlobal';

const requiredText = 'Trường bắt buộc không được để trống';

export const CreateCompanyFeePolicySchema = yup.object({
  name: yup
    .string()
    .trim()
    .max(200)
    .required('Vui lòng nhập tên chương trình phí')
    .typeError('Vui lòng nhập tên chương trình phí'),
  // .typeError('Tên chính sách phí không vượt quá 200 ký tự'),
  // dateRange: yup.array().required(requiredText).min(2, requiredText).max(2, requiredText),
  feeType: yup.number().min(0).max(1).required(),
  // feeSharingType: yup.number().min(0).max(1).required(),
  feeSharingValue: yup.mixed().when('feeType', (feeType, schema) => {
    if (feeType == 0) {
      return yup
        .number()
        .typeError('Vui lòng nhập giá trị')
        .required('Vui lòng nhập giá trị ')
        .test(
          'check-total-fee-value',
          'Giá trị không hợp lệ',
          function (checkFeeValue) {
            const { feeValue, feeRangeType, feeSharingValue, feeSharingType } =
              this.parent;
            if (feeRangeType[0] == 1 && feeSharingType == 2) {
              if (feeValue[0] < feeSharingValue) {
                return false;
              }
            }
            return true;
          }
        );
    } else {
      return yup
        .number()
        .min(0)
        .typeError('Vui lòng nhập giá trị')
        .required('Vui lòng nhập giá trị');
    }
  }),
  upperFeeLimit: yup
    .string()
    .nullable()
    .when('applyUpperFeeLimit', (val, schema) => {
      if (val) {
        return yup
          .string()
          .nullable()
          .matches(/^\d+$/, 'Vui lòng chỉ nhập số')
          .typeError('Vui lòng nhập giá trị')
          .required('Vui lòng nhập giá trị');
      } else {
        return yup.string().nullable().notRequired();
      }
    }),
  lowerFeeLimit: yup
    .string()
    .nullable()
    .when('applyLowerFeeLimit', (val, schema) => {
      if (val) {
        return yup
          .string()
          .nullable()
          .matches(/^\d+$/, 'Vui lòng chỉ nhập số')
          .typeError('Vui lòng nhập giá trị')
          .required('Vui lòng nhập giá trị');
      } else {
        return yup.string().nullable().notRequired();
      }
    }),
  rangeList: yup
    .array()
    .of(
      yup.mixed().validateRangeValueRow('Vui lòng nhập các giá trị còn thiếu')
    )
    .required('Thời điểm trả lương là trường bắt buộc')
    .test(
      'is-right-rangeList-size',
      'Cần nhập ít nhất 2 giá trị khoảng tiền',
      function (rangeList) {
        const { feeType } = this.parent;
        let isValid = true;

        if (feeType == 1 && rangeList?.length < 2) {
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

        for (let i = 1; i < rangeList?.length; i++) {
          if (rangeList[i].from <= rangeList[i - 1].from) {
            isValid = false;
            break;
          }
        }
        return isValid;
      }
    )
    .test('is-right-fee', 'Giá trị phí không hợp lệ', function (rangeList) {
      let isValid = true;

      for (let i = 0; i < rangeList?.length; i++) {
        if (rangeList[i].fee < 0) {
          isValid = false;
          break;
        }
      }
      for (let i = 0; i < rangeList?.length; i++) {
        if (rangeList[i].feeType === 1 && rangeList[i].fee > 100) {
          isValid = false;
          break;
        }
      }
      return isValid;
    }),

  // feeValue: (yup.mixed() as any).validateApplyFeeValue(),
  feeValue: yup.lazy((val) =>
    Array.isArray(val)
      ? yup
          .array()
          // .of(yup.number())
          .typeError('Giá trị không hợp lệ')
          // .transform((value) => (isNaN(value) ? undefined : value))
          .nullable()
          .test('is-right-feeValue', 'Giá trị không hợp lệ', function () {
            const { parent } = this;
            const { feeType, feeValue, feeRangeType } = parent;
            if (feeRangeType.length > 0 && feeType == 0) {
              if (
                (feeRangeType[0] == 1 && feeValue[0] > 100) ||
                feeValue[0] === ''
              ) {
                return false;
              }
            }
            return true;
          })
      : yup
          .number()
          .typeError('Giá trị không hợp lệ')
          .transform((value) => (isNaN(value) ? undefined : value))
          .nullable()
  ),

  // feeValue: yup
  //   .array()
  //   .of(
  //     yup
  //       .string()
  //       .typeError('Vui lòng nhập giá trị')
  //       .required('Vui lòng nhập giá trị')
  //   )
  //   .min(1, 'Vui lòng nhập giá trị')
  //   .typeError('Vui lòng nhập giá trị')
  //   .required('Vui lòng nhập giá trị'),
  // feeRangeType: yup
  //   .array()
  //   .required('Vui lòng chọn loại giá trị')
  //   .typeError('Vui lòng chọn loại giá trị')
  //   .min(1)
  //   .of(yup.number().nullable()),
  // 'feeValue.0': yup.number().required('range2.0 is required'),
});
