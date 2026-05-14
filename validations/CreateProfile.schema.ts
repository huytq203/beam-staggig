import { requiredNumber } from './companies';
import { requiredText } from './message';
import yup from './yupGlobal';
export const CreateProfileSchema = yup.object({
  creditLimit: yup
    .number()
    .typeError(requiredText)
    .required('Vui lòng nhập tổng hạn mức'),
  payLimitSalary: yup
    .number()
    .nullable()
    .when('payLimitType', (val, schema) => {
      if (val === 1) {
        return yup
          .number()
          .min(0, 'Giá trị không hợp lệ')
          .transform((_, val) => (val === Number(val) ? val : null))
          .typeError(requiredNumber)
          .required('Vui lòng chọn chính sách hạn mức');
      } else {
        return yup.number().nullable().notRequired();
      }
    }),
  validDateTimeRange: yup
    .array()
    .min(2, 'Vui lòng chọn ngày bắt đầu / ngày kết thúc')
    .required('Vui lòng chọn ngày bắt đầu / ngày kết thúc'),
  payForm: yup.mixed().when('workDayType', (workDayType, schema) => {
    if (
      workDayType !== 'FIXED_WORKDAY' &&
      workDayType !== 'PAY_LIMIT_FIXED_DATE'
    ) {
      return yup
        .mixed()
        .typeError('Vui lòng chọn loại hình trả lương')
        .required('Vui lòng chọn loại hình trả lương');
    } else {
      return yup.mixed().nullable().notRequired();
    }
  }),
  payDay: yup.mixed().when('workDayType', (workDayType, schema) => {
    if (
      workDayType !== 'FIXED_WORKDAY' &&
      workDayType !== 'PAY_LIMIT_FIXED_DATE'
    ) {
      return yup
        .mixed()
        .typeError('Vui lòng chọn ngày trả lương')
        .required('Vui lòng chọn ngày trả lương')
        .test('is-right-payday', 'Sai ngày trả lương', function (payDayList) {
          const { payForm, payDay } = this.parent;
          if (!payDay) return false;

          if (payForm == 1 && payDay.length != 2) {
            return false;
          }
          return true;
        });
    } else {
      return yup.number().nullable().notRequired();
    }
  }),
  // .required('Vui lòng chọn ngày trả lương')
  // workday: yup.mixed().when('workDayType', (workDayType, schema) => {
  //   if (workDayType !== 'FIXED_WORKDAY') {
  //     return yup
  //       .mixed()
  //       .typeError('Vui lòng chọn ngày bắt đầu chu kỳ công')
  //       .required('Vui lòng chọn ngày bắt đầu chu kỳ công')
  //       .test(
  //         'is-right-payday',
  //         'Sai ngày bắt đầu chu kỳ công',
  //         function (payDayList) {
  //           const { payForm, workday } = this.parent;
  //           if (!workday) return false;

  //           if (payForm == 1 && workday.length != 2) {
  //             return false;
  //           }
  //           return true;
  //         }
  //       );
  //   } else {
  //     return yup.mixed().nullable().notRequired();
  //   }
  // }),
  workday: yup
    .mixed()
    .typeError('Vui lòng chọn ngày bắt đầu chu kỳ công')
    .required('Vui lòng chọn ngày bắt đầu chu kỳ công')
    .test(
      'is-right-payday',
      'Sai ngày bắt đầu chu kỳ công',
      function (payDayList) {
        const { payForm, workday } = this.parent;
        if (!workday) return false;

        if (payForm == 1 && workday.length != 2) {
          return false;
        }
        return true;
      }
    ),
  // .required('Vui lòng chọn ngày bắt đầu Chu kỳ công')
  // payPolicy: yup.mixed().when('workDayType', (workDayType, schema) => {
  //   if (workDayType !== 'FIXED_WORKDAY') {
  //     return yup
  //       .mixed()
  //       .typeError('Vui lòng chọn kỳ trả lương')
  //       .required('Vui lòng chọn kỳ trả lương');
  //   } else {
  //     return yup.number().nullable().notRequired();
  //   }
  // }),
  lastWorkingDayOfPeriod: yup
    .mixed()
    .when('workDayType', (workDayType, schema) => {
      if (
        workDayType !== 'FIXED_WORKDAY' &&
        workDayType !== 'PAY_LIMIT_FIXED_DATE'
      ) {
        return yup
          .mixed()
          .typeError('Vui lòng chọn ngày chốt công')
          .required('Vui lòng chọn ngày chốt công')
          .test('is-right-lwdop', 'Sai ngày chốt công', function (payDayList) {
            const { payForm, lastWorkingDayOfPeriod } = this.parent;
            if (!payDayList) return false;

            // if (payForm == 0 && payDayList == null) {
            //   return false;
            // }
            if (payForm == 1 && payDayList.length != 2) {
              return false;
            }
            return true;
          });
      } else {
        return yup.mixed().nullable().notRequired();
      }
    }),
  // .required('Vui lòng chọn ngày chốt công')
  // payFeeType: yup.number().required(),
  // payFee: yup.number().required().test("base-payLimitType", "Invalid Pay Limit", function (credit) {
  //   const { payFeeType } = this.parent;
  //   if (payFeeType == 1 && (credit < 0 || credit > 100)) {
  //     return false;
  //   }
  //   return true;
  // }),
  status: yup.number().required().min(0).max(1),
  startSalaryAdvanceDay: yup
    .number()
    .nullable()
    .when('workDayType', (workDayType, schema) => {
      if (workDayType === 'FIXED_WORKDAY') {
        return yup
          .number()
          .min(0, 'Giá trị không hợp lệ')
          .transform((_, val) => (val === Number(val) ? val : null))
          .typeError('Vui lòng chọn ngày bắt đầu ứng lương')
          .required('Vui lòng chọn ngày bắt đầu ứng lương');
      } else {
        return yup.number().nullable().notRequired();
      }
    }),
  payLimitByDateEnabledStartDay: yup
    .number()
    .nullable()
    .when('workDayType', (workDayType, schema) => {
      if (workDayType === 'PAY_LIMIT_FIXED_DATE') {
        return yup
          .number()
          .min(0, 'Giá trị không hợp lệ')
          .transform((_, val) => (val === Number(val) ? val : null))
          .typeError('Vui lòng chọn ngày bắt đầu tính hạn mức')
          .required('Vui lòng chọn ngày bắt đầu tính hạn mức');
        // .test(
        //   'is-right-payLimitByDateEnabledStartDay',
        //   'Vui lòng chọn ngày bắt đầu tính hạn mức trong chu kỳ công',
        //   function (payLimitByDateEnabledStartDay: any) {
        //     const { workday } = this.parent;
        //     if (payLimitByDateEnabledStartDay < workday) {
        //       return false;
        //     }
        //     return true;
        //   }
        // );
      } else {
        return yup.number().nullable().notRequired();
      }
    }),
  payLimitByDateEnabledEndDay: yup
    .number()
    .nullable()
    .when('workDayType', (workDayType, schema) => {
      if (workDayType === 'PAY_LIMIT_FIXED_DATE') {
        return yup
          .number()
          .min(0, 'Giá trị không hợp lệ')
          .transform((_, val) => (val === Number(val) ? val : null))
          .typeError('Vui lòng chọn ngày kết thúc tính hạn mức')
          .required('Vui lòng chọn ngày kết thúc tính hạn mức');
        // .test(
        //   'is-right-payLimitByDateEnabledStartDay',
        //   'Vui lòng chọn ngày kết thúc tính hạn mức trong chu kỳ công',
        //   function (payLimitByDateEnabledStartDay: any) {
        //     const { workday } = this.parent;
        //     if (payLimitByDateEnabledStartDay < workday) {
        //       return false;
        //     }
        //     return true;
        //   }
        // );
      } else {
        return yup.number().nullable().notRequired();
      }
    }),
  endSalaryAdvanceDay: yup
    .number()
    .nullable()
    .when('workDayType', (workDayType, schema) => {
      if (workDayType === 'FIXED_WORKDAY') {
        return yup
          .number()
          .min(0, 'Giá trị không hợp lệ')
          .transform((_, val) => (val === Number(val) ? val : null))
          .typeError('Vui lòng chọn ngày kết thúc ứng lương')
          .required('Vui lòng chọn ngày kết thúc ứng lương');
      } else {
        return yup.number().nullable().notRequired();
      }
    }),
  uploadEmployeeStartDay: yup
    .mixed()
    .nullable()
    .when('workDayType', (workDayType, schema) => {
      if (workDayType === 'FIXED_WORKDAY') {
        return yup
          .number()
          .min(0, 'Giá trị không hợp lệ')
          .transform((_, val) => (val === Number(val) ? val : null))
          .typeError('Vui lòng nhập ngày bắt đầu tải lên danh sách NLĐ')
          .required('Vui lòng nhập ngày bắt đầu tải lên danh sách NLĐ');
      } else {
        return yup.mixed().nullable().notRequired();
      }
    }),
  uploadEmployeeEndDay: yup
    .mixed()
    .nullable()
    .when('workDayType', (workDayType, schema) => {
      if (workDayType === 'FIXED_WORKDAY') {
        return yup
          .number()
          .min(0, 'Giá trị không hợp lệ')
          .transform((_, val) => (val === Number(val) ? val : null))
          .typeError('Vui lòng nhập ngày kết thúc tải lên danh sách NLĐ')
          .required('Vui lòng nhập ngày kết thúc tải lên danh sách NLĐ');
      } else {
        return yup.mixed().nullable().notRequired();
      }
    }),
});
