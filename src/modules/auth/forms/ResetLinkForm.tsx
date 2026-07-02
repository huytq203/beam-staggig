import { Banner, Button, Input, Space } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthCard, BackToLogin } from '@modules/auth';
import { AuthServices } from '@services/auth';
import { UserSevice } from '@services/users';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { ResetPasswordSchema } from 'validations/Auth.schema';

export const ResetLinkForm = (props: any) => {
  const { verifyResponse } = props;
  const { userName, token } = verifyResponse;
  const [status, setStatus] = useState({
    finished: false,
    isSuccess: false,
  });
  const [isValid, setIsValid] = useState(true);
  const { data, isLoading, error, isError } = useQuery(
    ['check_reset'],
    () =>
      UserSevice.checkResetPasswordByLink({
        userName: userName,
        token: token,
      }),
    {
      // enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmitResetPassword = (data: any) => {
    UserSevice.resetPasswordByLink({
      userName: userName,
      token: token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    }).then((x: any) => {
      setStatus({
        finished: true,
        isSuccess: x,
      });
    });
  };
  useEffect(() => {
    setIsValid(data);
  }, [isLoading]);
  const errs: any = errors;
  return (
    <AuthCard
      title="Đặt mật khẩu"
      description="Vui lòng nhập mật khẩu đúng theo lưu ý của chúng tôi"
    >
      {!status.finished && isValid && (
        <form
          onSubmit={handleSubmit(onSubmitResetPassword)}
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
          <Button
            className="w-full"
            htmlType="submit"
            type="primary"
            theme="solid"
          >
            Đặt mật khẩu
          </Button>
        </form>
      )}

      {status.finished && status.isSuccess && (
        <>
          <Banner
            fullMode={false}
            bordered
            icon={null}
            closeIcon={null}
            type="success"
            description="Mật khẩu được đổi thành công!"
            className="my-4"
          />
        </>
      )}

      {!status.finished && !isValid && (
        <>
          <Banner
            fullMode={false}
            bordered
            icon={null}
            closeIcon={null}
            type="danger"
            description="Đường dẫn đổi mật khẩu đã hết hạn."
            className="my-4"
          />
        </>
      )}

      {status.finished && !status.isSuccess && (
        <>
          <Banner
            fullMode={false}
            bordered
            icon={null}
            closeIcon={null}
            type="danger"
            description="Something wrong when reset password"
            className="my-4"
          />
        </>
      )}

      <Space />
      <BackToLogin />
    </AuthCard>
  );
};
