import { Banner, Button, Input } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthCard, BackToLogin } from '@modules/auth';
import { AuthServices } from '@services/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ForgotPasswordSchema } from 'validations/Auth.schema';

export const ForgotPasswordForm = () => {
  const router = useRouter();

  const [isFinish, setIsFinish] = useState(false);

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

  const onResetPassword = (data: any) => {
    const { username } = data;
    AuthServices.resetPassword(username).then((x: any) => {
      if (x) {
        setIsFinish(true);
      }
    });
  };

  const errs: any = errors;

  return (
    <AuthCard title='Quên mật khẩu?' description='Vui lòng nhập tên tài khoản để tiếp tục.'>
      {!isFinish ? (
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
      ) : (
        <Banner
          fullMode={false}
          bordered
          icon={null}
          closeIcon={null}
          type='success'
          description='Thông tin đặt lại mật khẩu đã được gửi đến email của bạn!.'
          className='my-4'
        />
      )}

      <div className='mt-4'>
        <BackToLogin />
      </div>
    </AuthCard>
  );
};
