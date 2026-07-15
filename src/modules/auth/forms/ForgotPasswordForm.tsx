import { Banner, Button, Input, Space } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthCard, BackToLogin } from '@modules/auth';
import { AuthServices } from '@services/auth';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ForgotPasswordSchema } from 'validations/Auth.schema';

// Trang /auth/forgot: nhập tài khoản, ấn "Gửi thông tin" -> BE gửi email chứa
// link đặt lại mật khẩu (/auth/reset?users=&token=). Phần nhập mật khẩu + OTP
// nằm ở trang /auth/reset (ResetLinkForm) vì token chỉ có trong link email.
type Step = 'account' | 'sent';

export const ForgotPasswordForm = () => {
  const [step, setStep] = useState<Step>('account');

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

  const onSubmitAccount = async (data: any) => {
    // POST /account-manager/password/forgot/{userName} -> gửi email.
    // Lỗi (tài khoản không tồn tại...) đã được interceptor báo toast và trả
    // về undefined -> ở lại màn nhập tài khoản.
    const res = await AuthServices.resetPassword(data.username.trim());
    if (res) {
      setStep('sent');
    }
  };

  const errs: any = errors;

  if (step === 'sent') {
    return (
      <AuthCard
        title="Kiểm tra email"
        description="Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu."
      >
        <Banner
          fullMode={false}
          bordered
          icon={null}
          closeIcon={null}
          type="success"
          description="Đường dẫn đặt lại mật khẩu đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư (kể cả mục spam) và làm theo hướng dẫn."
          className="my-4"
        />
        <Space />
        <BackToLogin />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Quên mật khẩu?"
      description="Vui lòng nhập tên tài khoản để tiếp tục."
    >
      <form onSubmit={handleSubmit(onSubmitAccount)}>
        <div className="py-4 flex flex-col gap-2">
          <label className="font-semibold">Tên tài khoản</label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  placeholder="Nhập tên tài khoản"
                  size="large"
                  validateStatus={
                    errs['username']?.message.length ? 'error' : 'default'
                  }
                  {...field}
                />
              </>
            )}
          />
          {errs?.username?.message?.length > 0 && (
            <span className="text-red-500 text-sm">
              {errs?.username?.message}
            </span>
          )}
        </div>

        <Button
          className="w-full"
          htmlType="submit"
          type="primary"
          theme="solid"
        >
          Gửi thông tin
        </Button>
      </form>

      <div className="mt-4">
        <BackToLogin />
      </div>
    </AuthCard>
  );
};
