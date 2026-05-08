import { Banner, Button, Input, Space } from '@douyinfe/semi-ui'
import { yupResolver } from '@hookform/resolvers/yup'
import { AuthCard, BackToLogin } from '@modules/auth'
import { AuthServices } from '@services/auth'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ResetPasswordSchema } from 'validations/Auth.schema'

export const ResetForm = (props: any) => {
  const { verifyResponse } = props
  const { userId, reset_token } = verifyResponse
  const [status, setStatus] = useState({
    finished: false,
    isSuccess: false,
  })

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
  })

  const onSubmitResetPassword = (data: any) => {
    AuthServices.changeResetPassword({
      userId: userId,
      token: reset_token,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    }).then((x: any) => {
      setStatus({
        finished: true,
        isSuccess: x,
      })
    })
  }

  const errs: any = errors
  return (
    <AuthCard
      title="Set password"
      description="Your new password should be different to previously used
      passwords!"
    >
      {!status.finished && (
        <form
          onSubmit={handleSubmit(onSubmitResetPassword)}
          noValidate
          autoComplete="off"
        >
          <div className="flex flex-col gap-4 my-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    size="large"
                    placeholder="Password"
                    {...field}
                    validateStatus={
                      errs['password']?.message.length ? 'error' : 'default'
                    }
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Confirm password</label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    size="large"
                    placeholder="Confirm password"
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
            Reset password
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
            description="Password reset successfully"
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
  )
}
