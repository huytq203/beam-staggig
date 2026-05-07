import yup from '../yupGlobal';

export const reconciliationBank = yup.object({
  ftCode: yup
    .string()
    .required('Vui lòng nhập mã FT')
    .typeError('Vui lòng nhập mã FT'),
  amount: yup
    .string()
    .required('Vui lòng nhập số tiền')
    .typeError('Vui lòng nhập số tiền'),
});

export const reconciliationConcernFilter = yup.object({
  companyIds: yup
    .string()
    .when('companyDataLength', (companyDataLength, schema) => {
      if (companyDataLength > 2) {
        return yup
          .string()
          .required('Vui lòng chọn doanh nghiệp')
          .typeError('Vui lòng chọn doanh nghiệp');
      } else {
        return yup.string().nullable().notRequired();
      }
    })
    .nullable(),
  periods: yup
    .array()
    .min(1, 'Vui lòng chọn kỳ đối soát')
    .required('Vui lòng chọn kỳ đối soát')
    .typeError('Vui lòng chọn kỳ đối soát'),
});
