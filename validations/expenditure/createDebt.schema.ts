import yup from '../yupGlobal';
export const createDebt = yup.object({
  moneyAmount: yup
    .string()
    .required('Vui lòng nhập số tiền')
    .typeError('Vui lòng nhập số tiền'),
  companyId: yup
    .string()
    .required('Vui lòng chọn doanh nghiệp')
    .typeError('Vui lòng chọn doanh nghiệp'),
  salaryPeriod: yup
    .string()
    .required('Vui lòng chọn kỳ lương')
    .typeError('Vui lòng chọn kỳ lương'),
  transferType: yup
    .string()
    .required('Vui lòng chọn loại giao dịch')
    .typeError('Vui lòng chọn loại giao dịch'),
  savedDate: yup
    .string()
    .required('Vui lòng nhập ngày ghi nợ/có')
    .typeError('Vui lòng nhập ngày ghi nợ/có'),

  expiredDate: yup
    .string()
    .test(
      'is-valid-expired-date',
      'Vui lòng nhập ngày đến hạn',
      function (e: any) {
        const { transferType, type } = this.parent;
        if (transferType == 1 && type == 'IN_PERIOD' && (e == null || !e))
          return false;
        return true;
      }
    )
    .nullable(),
});
