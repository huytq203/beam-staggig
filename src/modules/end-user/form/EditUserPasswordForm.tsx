import { InputWrapper } from '@components/shared';
import { Button, Notification, Radio, RadioGroup } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserSevice } from '@services/users';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { CreateUserPassword } from 'validations/creatAccount.schema';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
export const EditUserPasswordForm = (props: any) => {
  const { beamUsername, onCancel } = props;
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateUserPassword),
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      code: '',
      role: '',
      enabled: true,
      passwordType: 0,
    },
  });
  const { authCheckByRole } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]);
  // useEffect(() => {
  //   if (!isLoading && !isNew) {
  //     reset(data);
  //   }
  // }, [isLoading, isFetching]);

  const onSubmitValues = (values: any) => {
    const payload = {
      password: values.password,
      reWritePassword: values.reWritePassword,
      userName: beamUsername,
    };
    setLoading(true);
    if (values.passwordType === 1) {
      UserSevice.resetPassword(payload).then((x: any) => {
        if (x?.code == 200 && x?.message == 'OK') {
          Notification.success({
            content: 'Thay đổi mật khẩu thành công',
            theme: 'light',
          });
          // router.push(`/end-user/beam-admin`);
          onCancel();
        } else {
          Notification.error({
            title: 'Error',
            content: 'Thay đổi mật khẩu thất bại!',
            duration: 3,
            theme: 'light',
          });
        }
        setLoading(false);
      });
    } else if (values.passwordType == 0) {
      UserSevice.getResetPasswordByLink(beamUsername).then((x: any) => {
        if (x?.code == 200 && x?.message == 'OK') {
          Notification.success({
            content: 'Đường dẫn đổi mật khẩu đã được gửi',
            theme: 'light',
          });
          // router.push(`/end-user/beam-admin`);
          onCancel();
        } else {
          Notification.error({
            title: 'Error',
            content: 'Gửi đường dẫn mật khẩu thất bại!',
            duration: 3,
            theme: 'light',
          });
        }
        setLoading(false);
      });
    }
  };
  return (
    <div>
      <SpinWrapper spinning={loading}>
        <form onSubmit={handleSubmit(onSubmitValues)}>
          <div>
            <div className="my-5">
              <InputWrapper
                field="passwordType"
                component={(props: any) => (
                  <RadioGroup name="create-password" {...props}>
                    <Radio value={0}>Gửi mật khẩu qua SMS</Radio>
                    {/* <Radio value={1}>Tạo mật khẩu</Radio> */}
                  </RadioGroup>
                )}
                errors={errors}
                control={control}
              />
              {/* {watch('passwordType') == 1 && (
              <div className='grid grid-cols-2 gap-4 mb-5'>
                <InputWrapper
                  required
                  field='password'
                  label='Mật khẩu mới'
                  component={(props: any) => <Input mode='password' {...props} />}
                  errors={errors}
                  control={control}
                />
                <InputWrapper
                  required
                  field='reWritePassword'
                  label='Nhập lại mật khẩu mới'
                  component={(props: any) => <Input mode='password' {...props} />}
                  errors={errors}
                  control={control}
                />
              </div>
            )} */}
            </div>
            <div className="flex gap-4 justify-end">
              <Button type="primary" onClick={onCancel}>
                Huỷ
              </Button>

              <Button
                type="primary"
                theme="solid"
                htmlType="submit"
                className="text-white"
              >
                Lưu
              </Button>
            </div>
          </div>
        </form>
      </SpinWrapper>
    </div>
  );
};
