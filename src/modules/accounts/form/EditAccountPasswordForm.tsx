import React, { useState } from 'react';
import { InputNumberByType, InputWrapper } from '@components/shared';
import {
  Button,
  Input,
  Notification,
  Radio,
  RadioGroup,
} from '@douyinfe/semi-ui';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { UserSevice } from '@services/users';
import { useAuth } from '@contexts/authentication';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChangePasswordSchema } from 'validations/Auth.schema';
export const EditAccountPasswordForm = (props: any) => {
  const { profile }: any = useAuth();
  const { signOut } = useAuth();

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createPassword, setCreatePassword] = useState(1);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      code: '',
      enabled: true,
    },
  });

  // useEffect(() => {
  //   if (!isLoading && !isNew) {
  //     reset(data);
  //   }
  // }, [isLoading, isFetching]);

  const onSubmitValues = (values: any) => {
    const payload = {
      userName: profile?.username,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };
    UserSevice.resetPasswordUser(payload).then((x: any) => {
      if (x?.code == 200 && x?.message == 'OK') {
        Notification.success({
          content:
            'Đổi mật khẩu thành công. Bạn vui lòng Đăng nhập lại để tiếp tục sử dụng',
          theme: 'light',
          duration: 10,
        });
        setTimeout(() => {
          signOut({
            noRedirect: true,
          });
        }, 2000);

        // router.push(`/dashboard`);
      }
    });
    // onSave && onSave(values);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div>
          <div className="my-5">
            {/* <RadioGroup
              onChange={(e: any) => setCreatePassword(e.target.value)}
              // value={updateForNewPeriod}
              name='create-password'
              defaultValue={1}
            >
              <Radio value={0}>Gửi link mật khẩu</Radio>
              <Radio value={1}>Tạo mật khẩu</Radio>
            </RadioGroup>
            {createPassword == 1 && ( */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <InputWrapper
                required
                field="oldPassword"
                label="Nhập mật khẩu cũ"
                component={(props: any) => <Input mode="password" {...props} />}
                errors={errors}
                control={control}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <InputWrapper
                required
                field="newPassword"
                label="Nhập mật khẩu mới"
                component={(props: any) => <Input mode="password" {...props} />}
                errors={errors}
                control={control}
              />
              <InputWrapper
                required
                field="confirmPassword"
                label="Nhập lại mật khẩu mới"
                component={(props: any) => <Input mode="password" {...props} />}
                errors={errors}
                control={control}
              />
            </div>
            {/* )} */}
          </div>
          <div className="flex gap-4 justify-end">
            <Button type="primary" onClick={() => router.push(`/dashboard`)}>
              Huỷ
            </Button>
            <Button
              type="primary"
              theme="solid"
              htmlType="submit"
              className="text-white"
            >
              Lưu thông tin
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
