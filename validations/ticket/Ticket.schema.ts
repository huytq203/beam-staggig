import yup from 'validations/yupGlobal';

export const RejectReasonTicket = yup.object({
  reason: yup.string().max(200).trim().required('Vui lòng nhập lý do từ chối'),
});
