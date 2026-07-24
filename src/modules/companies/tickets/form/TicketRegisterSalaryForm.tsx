import { BoxWrapper, FormActionButton, FormWrapper } from '@components/widgets';
import { Modal, Notification, TextArea } from '@douyinfe/semi-ui';
import { useQuery } from 'react-query';
import React, { useEffect, useState } from 'react';
import { TicketService } from '@services/ticket-management';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { InputWrapper } from '@components/shared';
import { useForm } from 'react-hook-form';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import { RejectReasonTicket } from 'validations/ticket';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
export const TicketRegisterSalaryForm = (props: any) => {
  const { ticketId, onCancel, setCheckData } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['ticket_detail', ticketId],
    () => TicketService.getTicket(ticketId),
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
    if (data?.oldEmployee.enabled === false) {
      Modal.confirm({
        title: 'Xác nhận hành động',
        cancelText: 'Quay lại',
        okText: 'Tiếp tục',
        onOk: async () => {
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
            .catch((e: any) => {
              setLoading(false);
            });
        },
        content:
          'Người lao động này đang được nghi nhận là đã nghỉ việc. Bạn có chắc chắn muốn chuyển trạng thái thành "Đang làm việc" và ghi đè thông tin người dùng đăng ký không?',
      });
    } else {
      Modal.confirm({
        title: 'Xác nhận hành động',
        cancelText: 'Quay lại',
        okText: 'Tiếp tục',
        onOk: async () => {
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
                onCancel();
                setLoading(false);
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
            .catch((e: any) => {
              setLoading(false);
            });
        },
        content:
          'Bạn có chắc chắn muốn ghi đè thông tin người dùng đăng ký không?',
      });
    }
  };

  const onProcess = () => {
    const URL = `companies/${data?.newEmployee.companyId}/employees/create?ticketId=${ticketId}`;
    FunctionBase.hrefBlank(URL);
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
          setLoading(false);
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
        setVisible(false);
      })
      .catch((e: any) => {
        setLoading(false);
        setVisible(false);
      });
  };
  const tripartiteAgreement = ['96cfddd5-61c2-40fc-9a69-451fab4b3384'];

  const dateRegister = () => {
    let date = DateTimeHelper.convertTimeZone(
      data?.requestTime,
      COMMON_FORMAT.DATE
    );
    let day = String(date.split('/')[0]);
    let month = String(date.split('/')[1]);
    let year = date.split('/')[2];
    return {
      day,
      month,
      year,
    };
  };

  const fillUsageAgreementForm = async () => {
    const formUrl = '/pdf/usage_agreement.pdf';
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch('/font/SVN_Times_New_Roman_2.ttf').then(
      (res) => res.arrayBuffer()
    );
    const timesRoman = await pdfDoc.embedFont(fontBytes);

    const fieldNames = [
      'user_name',
      'user_phone',
      'login_time',
      'user_otp',
      'day_now',
      'month_now',
      'year_now',
      'user_name2',
      'user_phone2',
      'identityNumber',
      'identificationProvideDay',
      'identificationAddress',
      'user_email',
      'employeeCode',
      // 'contract_number',
      'company_partner',
      'bankAccountNumber',
      'bankBranch',
      'user_signature',
    ];
    const fieldValues = [
      data?.newEmployee.name,
      `${data?.phoneNumber}`,
      DateTimeHelper.convertTimeZone(
        data?.requestTime,
        COMMON_FORMAT.DATE_TIME
      ),
      data?.newEmployee.registerOTP,
      `${dateRegister().day}`,
      `${dateRegister().month}`,
      `${dateRegister().year}`,
      data?.newEmployee.name,
      `${data?.phoneNumber}`,
      `${data?.newEmployee.identityNumber}`,
      DateTimeHelper.convertTimeZone(
        data?.newEmployee.identificationProvideDay,
        COMMON_FORMAT.DATE
      ),
      '',
      '',
      `${data?.newEmployee.employeeCode}`,
      // '',
      `${data?.newEmployee.companyName}`,
      '',
      '',
      data?.newEmployee.name,
    ];

    fieldNames.forEach((name, index) => {
      const field = form.getTextField(name);
      field.setText(fieldValues[index]);
      field.updateAppearances(timesRoman);
      field.enableReadOnly();
    });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
  };

  const fillUsageAgreementDownload = () => {
    const url = fillUsageAgreementForm().then((url) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `ThoaThuanSuDung-${data?.phoneNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    });
    return url;
  };

  const fillUsageAgreementPreview = () => {
    const url = fillUsageAgreementForm().then((url) => {
      window.open(url);
    });
    return url;
  };

  const fillTripartiteAgreementForm = async () => {
    const formUrl = '/pdf/tripartite_agreement.pdf';
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch('/font/SVN_Times_New_Roman_2.ttf').then(
      async (res) => {
        const arrayBuffer = await res.arrayBuffer();
        return arrayBuffer;
      }
    );
    const timesRoman = await pdfDoc.embedFont(fontBytes);

    const fieldNames = [
      'day_now',
      'month_now',
      'year_now',
      'user_name',
      'employeeCode',
      'birth_date',
      'identityNumber',
      'identificationProvideDay',
      'identificationAddress',
      'address',
      'user_phone',
      'user_email',
      'bankAccountNumber',
      'bankBranch',
      'user_name2',
      'user_name3',
      'user_phone2',
      'login_time',
      'user_otp',
    ];
    const fieldValues = [
      `${dateRegister().day}`,
      `${dateRegister().month}`,
      `${dateRegister().year}`,
      data?.newEmployee.name,
      `${data?.newEmployee.employeeCode}`,
      DateTimeHelper.convertTimeZone(
        data?.newEmployee.birthDay,
        COMMON_FORMAT.DATE_TIME
      ),
      `${data?.newEmployee.identityNumber}`,
      DateTimeHelper.convertTimeZone(
        data?.newEmployee.identificationProvideDay,
        COMMON_FORMAT.DATE
      ),
      '',
      '',
      `${data?.phoneNumber}`,
      '',
      '',
      '',
      data?.newEmployee.name,
      data?.newEmployee.name,
      `${data?.phoneNumber}`,
      DateTimeHelper.convertTimeZone(
        data?.requestTime,
        COMMON_FORMAT.DATE_TIME
      ),
      data?.newEmployee.registerOTP,
    ];

    fieldNames.forEach((name, index) => {
      const field = form.getTextField(name);
      field.setText(fieldValues[index]);
      field.updateAppearances(timesRoman);
      field.enableReadOnly();
    });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
  };

  const fillTripartiteAgreementPreview = () => {
    const url = fillTripartiteAgreementForm().then((url) => {
      window.open(url);
    });
    return url;
  };

  const fillTripartiteAgreementDownload = () => {
    const url = fillTripartiteAgreementForm().then((url) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `ThoaThuan3ben-${data?.phoneNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    });
    return url;
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
          pageTitle={'Nội dung yêu cầu đăng ký ứng lương'}
          rejectButton={true}
          onCancel={onCancel}
          onDone={data?.oldEmployee.companyName ? doneTicket : onProcess}
          loading={loading}
          // doneButtonText={
          //   data?.oldEmployee.companyName ? 'Phê duyệt yêu cầu' : 'Xử lý yêu cầu'
          // }
          doneButtonText="Phê duyệt yêu cầu"
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
              <h1 className="mb-4">Thông tin ghi nhận trên hệ thống</h1>
              <div className="grid grid-cols-2 gap-4">
                <h4>Doanh nghiệp:</h4>
                <p>{data?.oldEmployee.companyName}</p>
                <>
                  <h4>Mã nhân viên:</h4>
                  <p>{data?.oldEmployee.employeeCode}</p>
                </>
                <h4>Số điện thoại:</h4>
                <p>{data?.oldEmployee.companyName ? data?.phoneNumber : ''}</p>
                <h4>Họ tên:</h4>
                <p>{data?.oldEmployee.name}</p>
                <h4>Ngày sinh:</h4>
                <p>
                  {DateTimeHelper.convertTimeZone(
                    data?.oldEmployee.birthDay,
                    COMMON_FORMAT.DATE
                  )}
                </p>
                <>
                  <h4>CCCD/CMT/Hộ chiếu:</h4>
                  <p>{data?.oldEmployee.identityNumber}</p>
                </>
                <>
                  <h4>Ngày cấp CCCD/CMT/Hộ chiếu:</h4>
                  <p>
                    {DateTimeHelper.convertTimeZone(
                      data?.oldEmployee.identificationProvideDay,
                      COMMON_FORMAT.DATE
                    )}
                  </p>
                </>
                <h4>Trạng thái:</h4>
                <p
                  className={`${
                    data?.oldEmployee.enabled
                      ? 'text-blue-600 font-bold'
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {data?.oldEmployee.enabled
                    ? 'Đang làm việc'
                    : data?.oldEmployee.enabled == false
                    ? 'Đã nghỉ việc'
                    : 'Không có trên hệ thống'}
                </p>
              </div>
            </BoxWrapper>
            <BoxWrapper padding={6}>
              <h1 className="mb-4">Thông tin đăng ký</h1>
              <div className="grid grid-cols-2 gap-4">
                <h4>Doanh nghiệp:</h4>
                <p
                  className={`${
                    data?.oldEmployee.companyName ===
                    data?.newEmployee.companyName
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {data?.newEmployee.companyName}
                </p>
                <>
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
                </>

                <h4>Số điện thoại:</h4>
                <p>{data?.phoneNumber}</p>
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
                    data?.oldEmployee.birthDay === data?.newEmployee.birthDay
                      ? ''
                      : 'text-red-600 font-bold'
                  }`}
                >
                  {DateTimeHelper.convertTimeZone(
                    data?.newEmployee.birthDay,
                    COMMON_FORMAT.DATE
                  )}
                </p>
                <>
                  <h4>CCCD/CMT/Hộ chiếu:</h4>
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
                </>
                <>
                  <h4>Ngày cấp CCCD/CMT/Hộ chiếu:</h4>
                  <p
                    className={`${
                      data?.oldEmployee.identificationProvideDay ===
                      data?.newEmployee.identificationProvideDay
                        ? ''
                        : 'text-red-600 font-bold'
                    }`}
                  >
                    {DateTimeHelper.convertTimeZone(
                      data?.newEmployee.identificationProvideDay,
                      COMMON_FORMAT.DATE
                    )}
                  </p>
                </>
                <h4>Nội dung phản hồi:</h4>
                <p>{data?.newEmployee.description}</p>
                {data?.registerType === 'V2' && (
                  <>
                    <>
                      <h4>Thỏa thuận đăng ký của NLĐ (PDF):</h4>
                      <div className="flex gap-8">
                        <p
                          onClick={fillUsageAgreementDownload}
                          className="underline cursor-pointer text-blue-600"
                        >
                          Tải xuống
                        </p>
                        <p
                          onClick={fillUsageAgreementPreview}
                          className="underline cursor-pointer text-green-600"
                        >
                          Xem trước
                        </p>
                      </div>
                    </>
                    {tripartiteAgreement.includes(
                      data?.newEmployee?.companyId
                    ) && (
                      <>
                        <h4>Thỏa thuận ba bên (PDF):</h4>
                        <div className="flex gap-8">
                          <p
                            onClick={fillTripartiteAgreementDownload}
                            className="underline cursor-pointer text-blue-600"
                          >
                            Tải xuống
                          </p>
                          <p
                            onClick={fillTripartiteAgreementPreview}
                            className="underline cursor-pointer text-green-600"
                          >
                            Xem trước
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </BoxWrapper>
          </div>
        </div>
        {data?.status == 2 && (
          <div className="pt-6 px-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 mt-4">
              <BoxWrapper padding={6}>
                <h3 className="mb-4">Yêu cầu đã bị từ chối</h3>
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
          footer={[]}
          afterClose={() => setValue('reason', '')}
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
              loading={loading}
            />
          </form>
        </Modal>
      </div>
    </SpinWrapper>
  );
};
