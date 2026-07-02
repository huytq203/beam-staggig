import { BoxWrapper, FormActionButton, FormWrapper } from '@components/widgets';
import { Modal, Notification, TextArea } from '@douyinfe/semi-ui';
import { useQuery } from 'react-query';
import React, { useEffect, useState } from 'react';
import { TicketService } from '@services/ticket-management';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { InputWrapper } from '@components/shared';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RejectReasonTicket } from 'validations/ticket';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
export const TicketUpdateInformationForm = (props: any) => {
  const { ticketId, onCancel, setCheckData } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['ticket_detail', ticketId],
    () => TicketService.getTicket(ticketId),
    {
      enabled: ticketId != null,
      refetchOnWindowFocus: true,
      refetchIntervalInBackground: true,
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
    setLoading(true);
    TicketService.doneTicketInformation(ticketId)
      .then((response: any) => {
        if (response.code == 200) {
          Notification.success({
            title: 'Thành công',
            content: 'Xử lý yêu cầu thành công',
            duration: 3,
            theme: 'light',
          });
          setLoading(false);
          onCancel();
        } else {
          Notification.error({
            title: 'Thất bại',
            content: 'Xử lý yêu cầu không thành công',
            duration: 3,
            theme: 'light',
          });
          setLoading(false);
        }
      })
      .catch((e: any) => {});
    setLoading(false);
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
    TicketService.rejectTicketInformation(payload)
      .then((response: any) => {
        if (response.code == 200) {
          Notification.success({
            title: 'Thành công',
            content: 'Từ chối yêu cầu thành công',
            duration: 3,
            theme: 'light',
          });
          onCancel();
        } else {
          Notification.error({
            title: 'Thất bại',
            content: 'Từ chối yêu cầu thất bại',
            duration: 3,
            theme: 'light',
          });
          setLoading(false);
        }
      })
      .catch((e: any) => {});
    setLoading(false);

    setVisible(false);
  };
  useEffect(() => {
    if (!data && !isLoading) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;
  return (
    <SpinWrapper spinning={loading}>
      <div>
        <FormWrapper
          pageTitle={'Nội dung yêu cầu thay đổi thông tin'}
          rejectButton={true}
          onCancel={onCancel}
          onDone={doneTicket}
          doneButtonText={'Phê duyệt yêu cầu'}
          onReject={onReject}
          showDoneButton={
            data?.status == 0 && profile?.roles[0] == UserRole.HR_ADMIN
          }
          showRejectButton={
            data?.status == 0 && profile?.roles[0] == UserRole.HR_ADMIN
          }
          // showProcessButton={data?.status == 0}
          // onProcess={() => {
          //   const URL = `companies/${data?.companyId}/accounts/${data?.employeeId}/edit?ticketId=${ticketId}`;
          //   // if (typeof window !== 'undefined') {
          //   //   window.open(URL);
          //   // }
          //   FunctionBase.hrefBlank(URL);
          // }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <h4>Trạng thái:</h4>
              <p>
                {data?.status == 0
                  ? 'Chờ phê duyệt'
                  : data?.status == 1
                  ? 'Đã phê duyệt'
                  : data?.status == 2
                  ? 'Từ chối'
                  : 'Huỷ'}
              </p>
              <h4>Ngày yêu cầu:</h4>
              <p>
                {DateTimeHelper.convertTimeZone(
                  data?.requestTime,
                  COMMON_FORMAT.DATE_TIME
                )}
              </p>
              {/* <h4>Họ và tên:</h4>
            <p>{data?.name}</p> */}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h4>Mã yêu cầu:</h4>
              <p>{data?.code}</p>
              <h4>Ngày xử lý:</h4>
              <p>
                {DateTimeHelper.convertTimeZone(
                  data?.processTime,
                  COMMON_FORMAT.DATE_TIME
                )}
              </p>
              {/* <h4>Mã nhân viên:</h4>
            <p>{data?.employeeCode}</p> */}
            </div>
          </div>
        </FormWrapper>
        <div className="pt-6 px-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <BoxWrapper padding={6}>
              <h1 className="mb-4">Thông tin cũ</h1>
              <div className="grid grid-cols-2 gap-4">
                <h4>Mã nhân viên:</h4>
                <p>{data?.oldEmployee.employeeCode}</p>
                <h4>Họ tên:</h4>
                <p>{data?.oldEmployee.name}</p>
                <h4>Ngày sinh:</h4>
                <p>
                  {DateTimeHelper.formatDateTime(
                    data?.oldEmployee.dob,
                    COMMON_FORMAT.DATE
                  )}
                </p>
                <h4>Giới tính:</h4>
                <p>
                  {data?.oldEmployee.gender == 0
                    ? 'Nam'
                    : data?.oldEmployee.gender == 1
                    ? 'Nữ'
                    : 'Khác'}
                </p>
                <h4>Ngân hàng:</h4>
                <p>{data?.oldEmployee.bankName}</p>
                <h4>Chi nhánh:</h4>
                <p>{data?.oldEmployee.bankBranch}</p>
                <h4>Số tài khoản:</h4>
                <p>{data?.oldEmployee.bankAccountNumber}</p>
                <h4>Chủ tài khoản:</h4>
                <p>{data?.oldEmployee.bankHolderName}</p>
                <h4>CCCD/CMT:</h4>
                <p>{data?.oldEmployee.identityNumber}</p>
              </div>
            </BoxWrapper>
            <BoxWrapper padding={6}>
              <h1 className="mb-4">Thông tin yêu cầu cập nhật</h1>
              <div className="grid grid-cols-2 gap-4">
                <h4>Mã nhân viên:</h4>
                <p
                  className={`${
                    data?.oldEmployee.employeeCode ===
                    data?.newEmployee.employeeCode
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {data?.newEmployee.employeeCode}
                </p>
                <h4>Họ tên:</h4>
                <p
                  className={`${
                    data?.oldEmployee.name === data?.newEmployee.name
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {data?.newEmployee.name}
                </p>
                <h4>Ngày sinh:</h4>
                <p
                  className={`${
                    data?.oldEmployee.dob === data?.newEmployee.dob
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {DateTimeHelper.formatDateTime(
                    data?.newEmployee.dob,
                    COMMON_FORMAT.DATE
                  )}
                </p>
                <h4>Giới tính:</h4>
                <p
                  className={`${
                    data?.oldEmployee.gender === data?.newEmployee.gender
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {data?.newEmployee.gender == 0
                    ? 'Nam'
                    : data?.newEmployee.gender == 1
                    ? 'Nữ'
                    : 'Khác'}
                </p>
                <h4>Ngân hàng:</h4>
                <p
                  className={`${
                    data?.oldEmployee.bankName === data?.newEmployee.bankName
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {data?.newEmployee.bankName}
                </p>
                <h4>Chi nhánh:</h4>
                <p
                  className={`${
                    data?.oldEmployee.bankBranch ===
                    data?.newEmployee.bankBranch
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {data?.newEmployee.bankBranch}
                </p>
                <h4>Số tài khoản:</h4>
                <p
                  className={`${
                    data?.oldEmployee.bankAccountNumber ===
                    data?.newEmployee.bankAccountNumber
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {data?.newEmployee.bankAccountNumber}
                </p>
                <h4>Chủ tài khoản:</h4>
                <p
                  className={`${
                    data?.oldEmployee.bankHolderName ===
                    data?.newEmployee.bankHolderName
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {data?.newEmployee.bankHolderName}
                </p>
                <h4>CCCD/CMT:</h4>
                <p
                  className={`${
                    data?.oldEmployee.identityNumber ===
                    data?.newEmployee.identityNumber
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {data?.newEmployee.identityNumber}
                </p>
              </div>
            </BoxWrapper>
          </div>
        </div>
        {(data?.status == 2 || data?.status == 3) && (
          <div className="pt-6 px-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 mt-4">
              <BoxWrapper padding={6}>
                <h3 className="mb-4">
                  Yêu cầu đã bị {data?.status == 2 ? 'từ chối' : 'huỷ'}
                </h3>
                <p>Lý do: {data?.rejectedReason}</p>
              </BoxWrapper>
            </div>
          </div>
        )}
        <Modal
          title="Từ chối yêu cầu cập nhật thông tin"
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
