import {
  InputWrapper,
  StepSlider,
  STEP_SLIDE_EASE,
  STEP_SLIDE_MS,
  usePrefersReducedMotion,
} from '@components/shared';
import { Button, Input, Modal, Notification } from '@douyinfe/semi-ui';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { StringHelper } from '@helpers/string.helper';
import { AuthServices } from '@services/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchema } from 'validations/Auth.schema';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { useQuery } from 'react-query';
import { ReconciliationService } from '@services/reconciliation';
import { ReconciliationAPIs } from '@services/reconciliation/apis';
import { getResponseMessage } from '@services/api/handlers';
import { VerifyOTP, VerifyOTPHandle } from '@modules/auth/components';

type ReconciliationStep = 'credentials' | 'otp';

interface PendingCredentials {
  username: string;
  password: string;
}

interface OtpChallenge {
  phoneHint: string;
  /** Tăng mỗi lần backend phát mã mới. Dùng làm key để dựng lại màn OTP
   *  ở trạng thái sạch, thay vì kế thừa lỗi/đếm ngược của lần trước. */
  seq: number;
}

const GENERIC_RECONCILIATION_ERROR =
  'Chốt đối soát chưa thành công, vui lòng thử lại.';

// getResponseMessage trả về chính key khi không có bản dịch — với người dùng
// doanh nghiệp thì một mã lỗi trần còn khó hiểu hơn là không nói gì.
const describeReconciliationError = (message?: string) => {
  if (!message) return GENERIC_RECONCILIATION_ERROR;
  const translated = getResponseMessage(message);
  return translated === message ? GENERIC_RECONCILIATION_ERROR : translated;
};

export default function CheckReconciliationPage() {
  const router = useRouter();
  const {
    companyId: companyId,
    startDate: startDate,
    endDate: endDate,
    accessKey: accessKey,
  } = router.query;
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [step, setStep] = useState<ReconciliationStep>('credentials');
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [credentials, setCredentials] = useState<PendingCredentials | null>(
    null
  );
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const otpRef = useRef<VerifyOTPHandle | null>(null);
  const credentialsPanelRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const slideDuration = reducedMotion ? 0 : STEP_SLIDE_MS;

  const param = {
    companyId: companyId,
    startTime: startDate,
    endTime: endDate,
    accessKey: accessKey,
  };

  const { data, refetch } = useQuery(
    ['reconciliation-landing', param],
    () => ReconciliationService.getReconciliationLandingPage(param),
    {
      enabled: companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      username: null,
      password: null,
    },
  });

  const handleConfirm = () => {
    setStep('credentials');
    setChallenge(null);
    setCredentials(null);
    reset();
    setShowLoginForm(true);
  };

  const closeModal = () => {
    setShowLoginForm(false);
    setStep('credentials');
    setChallenge(null);
    setCredentials(null);
    reset();
  };

  const backToCredentials = () => setStep('credentials');

  // Bước 1: backend kiểm tra quyền hr_admin + mật khẩu rồi gửi OTP SMS,
  // trả { requireOtp, phoneHint } và KHÔNG kèm token.
  // Trả về null khi thất bại — interceptor của axios đã tự hiện thông báo lỗi.
  const requestOtp = async (username: string, password: string) => {
    const response = await AuthServices.loginReciliation({
      username: username,
      password: password,
    });
    return response?.data?.data ?? null;
  };

  // Gọi API chốt đối soát bằng token vừa cấp sau khi xác thực OTP.
  // Cố tình KHÔNG ném lỗi ra ngoài: tới bước này OTP đã bị tiêu huỷ, nên bắt người
  // dùng nhập lại mã cũ là vô nghĩa — hỏng thì đưa hẳn về bước nhập tài khoản.
  const finalizeReconciliation = async (accessToken: string) => {
    const payload = new FormData();
    payload.append('companyId', `${companyId}`);
    payload.append('type', 'COMPANY_FINAL');
    payload.append('startDate', `${startDate}`);
    payload.append('endDate', `${endDate}`);
    payload.append('description', '');
    payload.append('reconciliationSourceType', 'EMAIL');
    payload.append('fileName', data?.fileName);

    try {
      const response = await fetch(
        `${ReconciliationAPIs.UPLOAD_FILE_RECONCILIATION_CONCERN}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: payload,
        }
      );
      // Core bọc kết quả trong CommonResponse: HTTP 200 vẫn có thể mang code lỗi.
      const body = await response.json().catch(() => null);
      const code = body?.code ?? response.status;

      if (response.ok && (code === 200 || code === 204)) {
        Notification.success({
          content: `Chốt đối soát thành công`,
          theme: 'light',
        });
        localStorage.setItem('isReconcilied', 'true');
        closeModal();
        refetch();
        return;
      }

      Notification.error({
        content: describeReconciliationError(body?.message),
        theme: 'light',
      });
      backToCredentials();
    } catch (error) {
      Notification.error({
        content: 'Không kết nối được máy chủ, vui lòng thử lại.',
        theme: 'light',
      });
      backToCredentials();
    }
  };

  const onSubmitCredentials = async (values: any) => {
    if (isRequestingOtp) return;
    const username = `${values.username}`.trim();
    const password = `${values.password}`.trim();

    setIsRequestingOtp(true);
    const response = await requestOtp(username, password);
    setIsRequestingOtp(false);

    if (!response) return;

    setCredentials({ username, password });

    // Backend tắt OTP và trả token thẳng -> chốt luôn, không dựng bước 2.
    if (response.access_token) {
      await finalizeReconciliation(response.access_token);
      return;
    }

    if (response.requireOtp) {
      setChallenge((prev) => ({
        phoneHint: response.phoneHint ?? '',
        seq: (prev?.seq ?? 0) + 1,
      }));
      setStep('otp');
    }
  };

  // Ném lỗi ở đây là chủ ý: VerifyOTP bắt để hiện thông báo và cho nhập lại mã.
  const handleVerifyOtp = async (otp: string) => {
    if (!credentials) {
      throw new Error('Phiên xác thực đã hết hạn, vui lòng đăng nhập lại.');
    }
    const response = await AuthServices.verifyReciliationLoginOtp({
      username: credentials.username,
      password: credentials.password,
      otp: otp,
    });
    const accessToken = response?.data?.data?.access_token;
    if (!accessToken) {
      throw new Error('Mã OTP không đúng hoặc đã hết hạn, vui lòng thử lại!');
    }
    await finalizeReconciliation(accessToken);
  };

  const handleResendOtp = async () => {
    if (!credentials) {
      throw new Error('Phiên xác thực đã hết hạn, vui lòng đăng nhập lại.');
    }
    const response = await requestOtp(
      credentials.username,
      credentials.password
    );
    if (!response?.requireOtp) {
      throw new Error('Không gửi lại được mã, vui lòng thử lại sau giây lát!');
    }
    // Giữ nguyên seq: VerifyOTP tự dọn ô nhập và đặt lại đếm ngược, dựng lại
    // component ở đây sẽ xoá luôn trạng thái "đang gửi lại" mà nó đang hiển thị.
    setChallenge((prev) => ({
      phoneHint: response.phoneHint ?? prev?.phoneHint ?? '',
      seq: prev?.seq ?? 1,
    }));
  };

  useEffect(() => {
    window.addEventListener('storage', handleReconciliation);

    function handleReconciliation() {
      const raw = localStorage.getItem('isReconcilied');
      let reconciliationValue: any = '';
      try {
        reconciliationValue = raw ? JSON.parse(raw) : '';
      } catch {
        reconciliationValue = '';
      }

      if (reconciliationValue === true || reconciliationValue === '') {
        if (typeof window !== 'undefined') {
          closeModal();
          refetch();
          localStorage.setItem('isReconcilied', 'false');
        }
      }
    }

    return () => {
      window.removeEventListener('storage', handleReconciliation);
    };
  }, []);

  return (
    <div
      className="w-full h-screen flex flex-col justify-center items-center "
      style={{
        backgroundImage: `url("/img/bgcheckreconcilistion.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {showLoginForm && (
        <Modal
          width={600}
          size="small"
          visible={showLoginForm}
          onCancel={closeModal}
          maskClosable={false}
          footer={[]}
        >
          {/* Thanh tiến trình chạy cùng nhịp với cú trượt: vạch đầy sang phải
              đúng lúc bước mới trượt vào từ phải. */}
          <div className="h-[3px] w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: step === 'otp' ? '100%' : '50%',
                transition: `width ${slideDuration}ms ${STEP_SLIDE_EASE}`,
              }}
            />
          </div>

          <StepSlider
            activeIndex={step === 'otp' ? 1 : 0}
            onSettled={(index) => {
              // Bước vừa rời đi bị ẩn khỏi thứ tự tab, nên focus phải được giao
              // lại cho bước mới — nếu không, người dùng bàn phím rơi về đầu tài liệu.
              if (index === 1) {
                otpRef.current?.focusFirst();
                return;
              }
              credentialsPanelRef.current
                ?.querySelector<HTMLInputElement>('input')
                ?.focus({ preventScroll: true });
            }}
          >
            <div className="pt-6" ref={credentialsPanelRef}>
              <div className="text-xl font-bold text-main">
                Xác thực tài khoản
              </div>
              <div className="mt-2 mb-6 text-subtext">
                Để thực hiện chốt đối soát vui lòng nhập thông tin tài khoản đã
                được cấp quyền
              </div>

              <form onSubmit={handleSubmit(onSubmitCredentials)}>
                <InputWrapper
                  field="username"
                  label="Tài khoản"
                  component={(props: any) => (
                    <Input
                      size="large"
                      placeholder="Nhập vào tài khoản"
                      type="text"
                      maxLength={30}
                      {...props}
                    />
                  )}
                  control={control}
                  errors={errors}
                />

                <InputWrapper
                  field="password"
                  label="Mật khẩu"
                  component={(props: any) => (
                    <Input
                      size="large"
                      placeholder="Password"
                      mode="password"
                      type="password"
                      maxLength={30}
                      {...props}
                    />
                  )}
                  control={control}
                  errors={errors}
                />

                <div className="mt-7 text-right">
                  <Button onClick={closeModal} type="primary">
                    Đóng
                  </Button>

                  <Button
                    className="ml-5"
                    loading={isRequestingOtp}
                    htmlType="submit"
                    type="primary"
                    theme="solid"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </form>
            </div>

            <div className="pt-6">
              {challenge && (
                <VerifyOTP
                  key={challenge.seq}
                  ref={otpRef}
                  variant="embedded"
                  maskedDestination={challenge.phoneHint}
                  description={
                    challenge.phoneHint
                      ? `Mã gồm 6 chữ số vừa được gửi tới số điện thoại ${challenge.phoneHint}. Nhập mã để hoàn tất chốt đối soát.`
                      : 'Mã gồm 6 chữ số vừa được gửi tới số điện thoại của tài khoản. Nhập mã để hoàn tất chốt đối soát.'
                  }
                  confirmLabel="Chốt đối soát"
                  onVerify={handleVerifyOtp}
                  onResend={handleResendOtp}
                  onBack={backToCredentials}
                />
              )}
            </div>
          </StepSlider>
        </Modal>
      )}
      <div className="w-3/5 h-96 rounded-xl flex-col justify-center items-center flex mt-6">
        <table className="table-auto w-2/3 border-black border-2 border-solid border-collapse">
          <tbody>
            <tr className="h-20">
              <th className="text-xl text-center border-black border-2 border-solid border-collapse font-normal">
                Tổng số NLĐ ứng lương
              </th>
              <td className="font-bold text-xl border-black border-2 border-solid border-collapse text-center">
                {data?.totalEmployeeSalaryAdvance
                  ? data?.totalEmployeeSalaryAdvance
                  : 0}
              </td>
            </tr>
            <tr className="h-20">
              <th className="text-xl text-center border-black border-2 border-solid border-collapse font-normal">
                Tổng số lượng giao dịch
              </th>
              <td className="font-bold text-xl border-black border-2 border-solid border-collapse text-center">
                {data?.totalTransaction ? data?.totalTransaction : 0}
              </td>
            </tr>
            <tr className="h-20">
              <th className="text-xl text-center border-black border-2 border-solid border-collapse  font-normal">
                Tổng số tiền NLĐ yêu cầu
              </th>
              <td className="font-bold text-xl border-black border-2 border-solid border-collapse text-center">
                {StringHelper.formatVND(data?.totalTransactionAmount, '0 ₫')}
              </td>
            </tr>
            <tr className="h-20">
              <th className=" text-xl text-center border-black border-2 border-solid border-collapse font-normal">
                Phí DN chia sẻ
              </th>
              <td className="font-bold text-xl border-black border-2 border-solid border-collapse text-center">
                {StringHelper.formatVND(data?.totalFeeCompanySharing, '0 ₫')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {data?.processed && (
        <p className="font-bold text-xl">
          {`Đối soát chốt kỳ lương từ ${DateTimeHelper.convertTimeZone(
            startDate,
            COMMON_FORMAT.DATE
          )} - ${DateTimeHelper.convertTimeZone(
            endDate,
            COMMON_FORMAT.DATE
          )} đã được ghi nhận thành công, vui lòng kiểm tra chi tiết`}{' '}
          <a
            className="font-bold text-xl text-red-600"
            href={`/reconciliation/concern?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`}
            target="_blank"
          >
            tại đây
          </a>
        </p>
      )}
      {data?.reconciliationExpired && (
        <p className="font-bold text-xl">Báo cáo đã hết hạn chốt đối soát</p>
      )}
      {!data?.reconciliationExpired && !data?.processed && (
        <div className="w-2/5 h-28 rounded-xl flex-col justify-center items-center flex border-black border-2 border-solid">
          <p className="font-bold xl:text-lg 2xl:text-xl">
            Bạn có chắc chắn muốn xác nhận chốt đối soát không?
          </p>
          <div className="w-1/2 flex justify-around mt-4">
            <Button theme="solid" onClick={handleConfirm}>
              Chắc chắn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
