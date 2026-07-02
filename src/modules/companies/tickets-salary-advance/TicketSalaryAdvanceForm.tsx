import { BoxWrapper, FormActionButton, FormWrapper } from '@components/widgets';
import { Modal, Notification, TextArea } from '@douyinfe/semi-ui';
import { useQuery } from 'react-query';
import React, { useState } from 'react';
import { TicketService } from '@services/ticket-management';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { InputWrapper } from '@components/shared';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RejectReasonTicket } from 'validations/ticket';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { StringHelper } from '@helpers/string.helper';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
export const TicketSalaryAdvanceForm = (props: any) => {
  const { ticketId, onCancel, companyData } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, refetch } = useQuery(
    ['ticket_detail', ticketId],
    () => TicketService.getTicketSalaryAdvance(ticketId),
    {
      enabled: ticketId != null,
      // refetchOnWindowFocus: false,
      // refetchIntervalInBackground: false,
    }
  );
  const { authCheckByRole, profile } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.HR_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
  ]);
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RejectReasonTicket),
    defaultValues: {
      reason: '',
    },
  });
  const doneTicket = () => {
    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Huỷ',
      okText: 'Thực hiện',
      onOk: async () => {
        setLoading(true);
        const data = await TicketService.doneTicketSalaryAdvance(ticketId)
          .then((response: any) => {
            if (response?.code == 200 && response?.message == 'OK') {
              Notification.success({
                title: 'Thành công',
                content: 'Xử lý yêu cầu thành công',
                duration: 3,
                theme: 'light',
              });
              setLoading(false);
              refetch();
              onCancel();
            }
            setLoading(false);
            refetch();
          })
          .catch((e: any) => {});
        setLoading(false);
      },
      content: 'Bạn có chắc chắn muốn phê duyệt yêu cầu ứng lương này không?',
    });

    // TicketService.doneTicketSalaryAdvance(ticketId)
    //   .then((response: any) => {
    //     if (response?.code == 200 && response?.message == 'OK') {
    //       Notification.success({
    //         title: 'Thành công',
    //         content: 'Xử lý yêu cầu thành công',
    //         duration: 3,
    //         theme: 'light',
    //       });
    //       setLoading(false);
    //       refetch();
    //       onCancel();
    //     }
    //     setLoading(false);
    //     refetch();
    //   })
    //   .catch((e: any) => {});
  };

  const onReject = () => {
    setVisible(true);
  };

  const onSubmit = (values: any) => {
    const payload = {
      id: ticketId,
      reason: values.reason,
    };
    setLoading(true);

    TicketService.rejectTicketSalaryAdvance(payload)
      .then((response: any) => {
        if (response?.code == 200 && response?.message == 'OK') {
          Notification.success({
            title: 'Thành công',
            content: 'Từ chối yêu cầu thành công',
            duration: 3,
            theme: 'light',
          });
          setLoading(false);
          refetch();
          onCancel();
        }
        setLoading(false);
        setVisible(false);
        refetch();
      })
      .catch((e: any) => {});
    setLoading(false);
  };
  const convertReason = (field: any) => {
    const ticketErrorReason: any = {
      EMPLOYEE_IS_EXPIRED: 'Nhân viên đã nghỉ việc',
      IS_BLOCK_SALARY_ADVANCE: 'Nhân viên bị khoá ứng lương',
      COMPANY_IS_BLOCKED: 'Công ty tạm khoá ứng lương',
      TICKET_SALARY_ADVANCE_EXPIRED: 'Yêu cầu ứng lương đã hết hạn',
      NO_ACTIVE_PROFILE: 'Không có hồ sơ hoạt động',
      TICKET_PROCESSED: 'Có yêu cầu chưa được xử lý',
      NOT_IN_SALARY_ADVANCE_TIME:
        'Khoảng thời gian ứng lương của doanh nghiệp đã được thay đổi',
      NOT_START_APPLY_DATE:
        'Ngày bắt đầu ứng lương của nhân sự đã được thay đổi',
      EXCEED_PAY_LIMIT:
        'Hạn mức khả dụng không đủ để thực hiện yêu cầu tạm ứng này',
      SALARY_ADVANCE_BE_CHANGED: 'Chức năng phê duyệt của HR bị thay đổi',
      BANK_ERROR: 'Hệ thống ngân hàng bận',
      BEN_NAME_MISMATCH: 'Tên chủ tài khoản không đúng',
      WRONG_ACCOUNT_NUMBER: 'Số tài khoản không tồn tại',
      COMPANY_PAY_LIMIT_EXCEED:
        'Số tiền đề xuất vượt quá hạn mức doanh nghiệp được cấp',
      VIETCOMBANK_INVALID_BEN_NAME:
        'Giao dịch thất bại do tên chủ tài khoản không chính xác',
      INVALID_BEN_ACCOUNT:
        'Giao dịch thất bại do số tài khoản ngân hàng thụ hưởng không chính xác',
      BANK_ACCOUNT_LOCKED:
        'Giao dịch thất bại do tài khoản ngân hàng thụ hưởng không đủ điều kiện thực hiện giao dịch',
      ERROR_QUERY_BEN_NAME:
        'Giao dịch thất bại do truy vấn thông tin tại ngân hàng thụ hưởng không thành công',
      TRANSFER_FAIL:
        'Giao dịch thất bại, vui lòng liên hệ với kênh CSKH Flexpay để được hỗ trợ',
    };

    if (!ticketErrorReason[field]) return field;
    return ticketErrorReason[field];
  };

  if (isLoading) return <></>;
  return (
    <SpinWrapper spinning={loading}>
      <div>
        <FormWrapper
          pageTitle={'Chi tiết yêu cầu ứng lương'}
          rejectButton={true}
          onCancel={onCancel}
          onDone={doneTicket}
          doneButtonText={'Phê duyệt yêu cầu'}
          onReject={onReject}
          showDoneButton={
            data?.status == 'PENDING' && profile?.roles[0] == UserRole.HR_ADMIN
          }
          showRejectButton={
            data?.status == 'PENDING' && profile?.roles[0] == UserRole.HR_ADMIN
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <h4>Họ tên:</h4>
              <p className="-ml-[20%]">{data?.name}</p>
              <h4>Số điện thoại:</h4>
              <p className="-ml-[20%]">{data?.phoneNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h4>Doanh nghiệp:</h4>
              <p className="-ml-[30%]">{data?.companyName}</p>
              <h4>Mã nhân viên:</h4>
              <p className="-ml-[30%]">{data?.employeeCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h4>Chức vụ:</h4>
              <p className="-ml-[20%]">
                {data?.position === 'EMPLOYEE' ? 'Nhân Viên' : 'Quản lý'}
              </p>
              <h4>Căn cước công dân:</h4>
              <p className="-ml-[20%]">{data?.identityNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h4>Ngày yêu cầu:</h4>
              <p className="-ml-[30%]">
                {DateTimeHelper.convertTimeZone(
                  data?.requestTime,
                  COMMON_FORMAT.DATE_TIME
                )}
              </p>
              <h4>Kỳ lương:</h4>
              <p className="-ml-[30%]">
                {`${DateTimeHelper.convertTimeZone(
                  data?.startPeriod,
                  COMMON_FORMAT.DATE
                )} - ${DateTimeHelper.convertTimeZone(
                  data?.endPeriod,
                  COMMON_FORMAT.DATE
                )}`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h4>Ngân hàng:</h4>
              <p className="-ml-[20%]">{data?.bankName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <h4>Số tài khoản:</h4>
              <p className="-ml-[30%]">{data?.bankAccountNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h4>Chi nhánh:</h4>
              <p className="-ml-[20%]">{data?.bankBranch}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <h4>Trạng thái yêu cầu:</h4>
              <p className="-ml-[30%]">
                {data?.status == 'PENDING'
                  ? 'Chờ phê duyệt'
                  : data?.status == 'ACCEPTED'
                  ? 'Đã phê duyệt'
                  : data?.status == 'REJECTED'
                  ? 'Từ chối'
                  : data?.status == 'SUCCESS'
                  ? 'Thành công'
                  : data?.status == 'CANCELLED'
                  ? 'Huỷ'
                  : 'Lỗi'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h4>Tên chủ tài khoản:</h4>
              <p className="-ml-[20%]">{data?.bankHolderName}</p>
            </div>
            {data?.ticketErrorReason ? (
              <div className="grid grid-cols-2 gap-4">
                <h4>Lý do:</h4>
                <p className="-ml-[30%]">
                  {convertReason(data?.ticketErrorReason)}
                </p>
              </div>
            ) : (
              ''
            )}
          </div>
        </FormWrapper>
        <div className="pt-6 px-6 flex flex-col gap-4">
          <BoxWrapper padding={6}>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <h4>Tổng hạn mức:</h4>
                <b>{StringHelper.formatVND(data?.totalPayLimit)}</b>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <h4>Hạn mức theo ngày công thực tế:</h4>
                <b>{StringHelper.formatVND(data?.currentPayLimit)}</b>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <h4>Số tiền đề xuất ứng:</h4>
                <b>{StringHelper.formatVND(data?.requestAmount)}</b>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <h4>Hạn mức khả dụng:</h4>
                <b>{StringHelper.formatVND(data?.availablePayLimit)}</b>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <h4>Số tiền NLĐ đã ứng trong kỳ:</h4>
                <b>{StringHelper.formatVND(data?.salaryAdvanced)}</b>
              </div>
              {companyData?.haveAdvancedAmount && (
                <div className="grid grid-cols-2 gap-4">
                  <h4>Giá trị đã ứng mồng 1:</h4>
                  <b>{StringHelper.formatVND(data?.advancedAmount)}</b>
                </div>
              )}
            </div>
          </BoxWrapper>
        </div>
        {data?.status == 'REJECTED' && (
          <div className="pt-6 px-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 mt-4">
              <BoxWrapper padding={6}>
                <h3 className="mb-4">Yêu cầu đã bị từ chối</h3>
                <p>Lý do: {data?.reason}</p>
              </BoxWrapper>
            </div>
          </div>
        )}
        <Modal
          title="Từ chối yêu cầu ứng lương"
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          afterClose={() => setValue('reason', '')}
          footer={[]}
          closeOnEsc={true}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 mb-3">
              <InputWrapper
                required
                field="reason"
                label="Lí do từ chối yêu cầu"
                component={(props: any) => (
                  <TextArea
                    maxLength={200}
                    maxCount={200}
                    showCounter
                    showClear
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
            </div>
            <FormActionButton
              // onSubmit={() => {
              //   setVisible(false);
              //   return onSubmit(getValues());
              // }}
              onCancel={() => setVisible(false)}
            />
          </form>
        </Modal>
      </div>
    </SpinWrapper>
  );
};
