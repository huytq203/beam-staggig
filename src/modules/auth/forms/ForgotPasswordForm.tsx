import { Button, Input, Notification } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthCard, BackToLogin, ResetForm, VerifyOTP } from '@modules/auth';
import { OtpServices } from '@services/auth';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ForgotPasswordSchema } from 'validations/Auth.schema';

type Step = 'account' | 'otp' | 'reset';

interface ResetPayload {
  userId: string;
  reset_token: string;
}

export const ForgotPasswordForm = () => {
  const [step, setStep] = useState<Step>('account');
  const [username, setUsername] = useState('');
  const [otpDestination, setOtpDestination] = useState('');
  const [resetPayload, setResetPayload] = useState<ResetPayload | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues: {
      username: '',
    },
  });

  const onResetPassword = async (data: any) => {
    const trimmedUsername = data.username.trim();
    try {
      const { maskedDestination } = await OtpServices.sendOtp(
        trimmedUsername
      );
      setUsername(trimmedUsername);
      setOtpDestination(maskedDestination);
      setStep('otp');
    } catch (error) {
      Notification.error({
        content: 'Không gửi được mã OTP, vui lòng thử lại!',
        theme: 'light',
        position: 'top',
      });
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const result = await OtpServices.verifyOtp({
      identifier: username,
      otp,
      purpose: 'reset-password',
    });
    setResetPayload({
      userId: result.userId as string,
      reset_token: result.reset_token as string,
    });
    setStep('reset');
  };

  const handleResendOtp = async () => {
    const { maskedDestination } = await OtpServices.sendOtp(username);
    setOtpDestination(maskedDestination);
  };

  const handleBackToAccount = () => {
    setStep('account');
  };

  const errs: any = errors;

  if (step === 'otp') {
    return (
      <VerifyOTP
        maskedDestination={otpDestination}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={handleBackToAccount}
      />
    );
  }

  if (step === 'reset' && resetPayload) {
    return <ResetForm verifyResponse={resetPayload} />;
  }

  return (
    <AuthCard title='Quên mật khẩu?' description='Vui lòng nhập tên tài khoản để tiếp tục.'>
      <form onSubmit={handleSubmit(onResetPassword)}>
        <div className='py-4 flex flex-col gap-2'>
          <label className='font-semibold'>Tên tài khoản</label>
          <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <>
                <Input
                  placeholder='Nhập tên tài khoản'
                  size='large'
                  validateStatus={errs['username']?.message.length ? 'error' : 'default'}
                  {...field}
                />
              </>
            )}
          />
          {errs?.username?.message?.length > 0 && (
            <span className='text-red-500 text-sm'>{errs?.username?.message}</span>
          )}
        </div>

        <Button className='w-full' htmlType='submit' type='primary' theme='solid'>
          Gửi thông tin
        </Button>
      </form>

      <div className='mt-4'>
        <BackToLogin />
      </div>
    </AuthCard>
  );
};
