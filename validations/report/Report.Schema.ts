import yup from '../yupGlobal';
export const ReportSchema = yup.object({
  dateRanges: yup
    .array()
    .min(2, 'Vui lòng chọn ngày bắt đầu / ngày kết thúc')
    .required('Vui lòng chọn ngày bắt đầu / ngày kết thúc'),
});
