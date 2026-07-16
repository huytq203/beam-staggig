import { Banner, Button, Input, Space, Spin } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthCard, BackToLogin, VerifyOTP } from '@modules/auth';
import { UserSevice } from '@services/users';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { ResetPasswordSchema } from 'validations/Auth.schema';

// Luồng (khớp backend): kiểm tra link -> nhập mật khẩu -> gửi OTP
// (POST /password/reset-by-link/send-otp) -> nhập OTP -> hoàn tất
// (POST /password/reset-by-link). Token lấy từ URL (?users=&token=).
type Step = 'password' | 'otp';

interface PasswordDraft {
  password: string;
  confirmPassword: string;
}

export const ResetLinkForm = (props: any) => {
  const { verifyResponse } = props;
  const { userName, token } = verifyResponse;
  const [step, setStep] = useState<Step>('password');
  const [passwordDraft, setPasswordDraft] = useState<PasswordDraft | null>(
    null
  );
  const [otpDestination, setOtpDestination] = useState('');
  const [status, setStatus] = useState({
    finished: false,
    isSuccess: false,
  });
  const { data, isLoading } = useQuery(
    ['check_reset'],
    () =>
      UserSevice.checkResetPasswordByLink({
        userName: userName,
        token: token,
      }),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Bước 1: nhập mật khẩu -> gửi OTP rồi sang màn OTP.
  const onSubmitPassword = async (formData: any) => {
    const draft: PasswordDraft = {
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };
    const challenge = await UserSevice.sendResetPasswordByLinkOtp({
      userName,
      token,
      ...draft,
    });
    // Lỗi (mật khẩu yếu / không khớp / link hết hạn) đã được interceptor báo
    // toast và trả về undefined -> ở lại màn nhập mật khẩu.
    if (!challenge) return;
    setPasswordDraft(draft);
    setOtpDestination(challenge.phoneHint ?? '');
    setStep('otp');
  };

  // Bước 2: xác thực OTP -> hoàn tất đổi mật khẩu.
  const handleVerifyOtp = async (otp: string) => {
    const res = await UserSevice.resetPasswordByLink({
      userName,
      token,
      ...(passwordDraft ?? { password: '', confirmPassword: '' }),
      otp,
    });
    // Sai OTP: BE trả lỗi (đã toast) và res undefined -> ném lỗi để màn OTP
    // hiển thị và xoá ô nhập.
    if (!res || res.code != 200) {
      throw new Error('Mã OTP không đúng hoặc đã hết hạn.');
    }
    setStatus({ finished: true, isSuccess: true });
  };

  const handleResendOtp = async () => {
    if (!passwordDraft) return;
    const challenge = await UserSevice.sendResetPasswordByLinkOtp({
      userName,
      token,
      ...passwordDraft,
    });
    if (challenge) setOtpDestination(challenge.phoneHint ?? '');
  };

  const errs: any = errors;

  // Đổi mật khẩu thành công.
  if (status.finished && status.isSuccess) {
    return (
      <AuthCard
        title="Đặt mật khẩu"
        description="Vui lòng nhập mật khẩu đúng theo lưu ý của chúng tôi"
      >
        <Banner
          fullMode={false}
          bordered
          icon={null}
          closeIcon={null}
          type="success"
          description="Mật khẩu được đổi thành công!"
          className="my-4"
        />
        <Space />
        <BackToLogin />
      </AuthCard>
    );
  }

  // Đang kiểm tra link -> hiển thị loading, tránh nháy màn "hết hạn".
  if (isLoading) {
    return (
      <AuthCard
        title="Đặt mật khẩu"
        description="Vui lòng nhập mật khẩu đúng theo lưu ý của chúng tôi"
      >
        <div className="flex justify-center my-8">
          <Spin size="large" />
        </div>
      </AuthCard>
    );
  }

  // Link không hợp lệ / hết hạn (chỉ xác định sau khi kiểm tra xong).
  if (!data) {
    return (
      <AuthCard
        title="Đặt mật khẩu"
        description="Vui lòng nhập mật khẩu đúng theo lưu ý của chúng tôi"
      >
        <Banner
          fullMode={false}
          bordered
          icon={null}
          closeIcon={null}
          type="danger"
          description="Đường dẫn đổi mật khẩu đã hết hạn."
          className="my-4"
        />
        <Space />
        <BackToLogin />
      </AuthCard>
    );
  }

  // Màn xác thực OTP.
  if (step === 'otp') {
    return (
      <VerifyOTP
        maskedDestination={otpDestination}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={() => setStep('password')}
      />
    );
  }

  // Màn nhập mật khẩu (mặc định).
  return (
    <AuthCard
      title="Đặt mật khẩu"
      description="Vui lòng nhập mật khẩu đúng theo lưu ý của chúng tôi"
    >
      <form
        onSubmit={handleSubmit(onSubmitPassword)}
        noValidate
        autoComplete="off"
      >
        <div className="flex flex-col gap-4 my-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Nhập mật khẩu</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  mode="password"
                  size="large"
                  placeholder="Nhập mật khẩu"
                  {...field}
                  validateStatus={
                    errs['password']?.message.length ? 'error' : 'default'
                  }
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Nhập lại mật khẩu</label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  mode="password"
                  size="large"
                  placeholder="Nhập lại mật khẩu"
                  validateStatus={
                    errs['confirmPassword']?.message.length
                      ? 'error'
                      : 'default'
                  }
                  {...field}
                />
              )}
            />
          </div>
          {(errs?.password?.message?.length > 0 ||
            errs.confirmPassword?.message.length > 0) && (
            <Banner
              fullMode={false}
              bordered
              icon={null}
              closeIcon={null}
              type="danger"
              description={
                errs?.password?.message?.length
                  ? errs.password.message
                  : errs.confirmPassword?.message
              }
            />
          )}
        </div>
        <Button className="w-full" htmlType="submit" type="primary" theme="solid">
          Tiếp tục
        </Button>
      </form>

      <Space />
      <BackToLogin />
    </AuthCard>
  );
};
