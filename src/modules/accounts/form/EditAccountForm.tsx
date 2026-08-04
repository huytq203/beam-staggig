import React, { useState } from 'react';
import { InputNumberByType, InputWrapper } from '@components/shared';
import { Button, Input, Notification, Select, TextArea } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { CompanySelect } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { AccountLockedStatusSelect } from '@modules/end-user/constants';
export const EditAccountForm = (props: any) => {
  const { beamUsername } = props;
  const { profile }: any = useAuth();
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['user_detail', profile?.username],
    () => UserSevice.getAdmin(profile?.username),
    {
      enabled: profile?.username !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(CreateCompanyGroupSchema),
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      code: '',
      enabled: true,
      accountLocked: false,
    },
  });
  useEffect(() => {
    if (!isLoading) {
      reset(data);
    }
  }, [isLoading, isFetching]);
  const onSubmitValues = (values: any) => {
    const payload = {
      // passwordType: createPassword,
      // password: {
      //   password: values.password,
      //   reWritePassword: values.reWritePassword,
      // },
      username: values.username.trim(),
      fullName: values?.fullName?.trim(),
      email: values?.email?.trim(),
      code: values?.code?.trim(),
      phone: values?.phone?.trim(),
      accountLocked:
        data?.accountLocked === true ? values.accountLocked === true : false,
    };
    UserSevice.updateAccountInformation(payload).then((x: any) => {
      if (x?.code == 200 && x?.message == 'OK') {
        Notification.success({
          content: 'Chỉnh sửa thông tin thành công',
          theme: 'light',
        });
        router.push(`/dashboard`);
      }
    });
    // onSave && onSave(values);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <InputWrapper
              required
              field='username'
              label='Tên đăng nhập'
              component={(props: any) => <Input disabled {...props} />}
              errors={errors}
              control={control}
            />
            <InputWrapper
              field='fullName'
              label='Họ và tên'
              component={(props: any) => <Input {...props} />}
              errors={errors}
              control={control}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <InputWrapper
              required
              field='email'
              label='Email'
              component={(props: any) => <Input disabled {...props} />}
              errors={errors}
              control={control}
            />
            <InputWrapper
              field='code'
              label='Mã nhân viên'
              component={(props: any) => <Input {...props} />}
              errors={errors}
              control={control}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <InputWrapper
              field='phone'
              label='Số điện thoại'
              component={(props: any) => <Input {...props} />}
              errors={errors}
              control={control}
            />
            <InputWrapper
              field='accountLocked'
              label='Trạng thái tạm khóa'
              component={(props: any) => (
                <AccountLockedStatusSelect {...props} />
              )}
              errors={errors}
              control={control}
            />
          </div>
          <div className='flex gap-4 justify-end'>
            <Button type='primary' onClick={() => router.push(`/dashboard`)}>
              Huỷ
            </Button>

            <Button type='primary' theme='solid' htmlType='submit' className='text-white'>
              Lưu thông tin
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
