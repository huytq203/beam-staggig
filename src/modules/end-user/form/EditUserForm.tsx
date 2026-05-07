import React, { useState } from 'react';
import { InputWrapper } from '@components/shared';
import {
  ContentWrapper,
  MainContentWrapper,
} from '@components/widgets/ContentWrapper';
import {
  Button,
  Input,
  Modal,
  Notification,
  Select,
  TextArea,
} from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { endUserStatusOptions } from '../constants';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { UserTabs } from '../user/UserTabs';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
export const EditUserForm = (props: any) => {
  const { beamUsername, setCheckData } = props;
  const router = useRouter();
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['beam_detail', beamUsername],
    () => UserSevice.getAdmin(beamUsername),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
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
      reason: '',
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
      username: FunctionBase.checkTypeofVal(values.username, 'string')
        ? values.username.trim()
        : null,
      fullName: FunctionBase.checkTypeofVal(values.fullName, 'string')
        ? values.fullName.trim()
        : null,
      email: FunctionBase.checkTypeofVal(values.email, 'string')
        ? values.email.trim()
        : null,
      code: FunctionBase.checkTypeofVal(values.code, 'string')
        ? values.code.trim()
        : null,
      phone: FunctionBase.checkTypeofVal(values.phone, 'string')
        ? values.phone.trim()
        : null,
      enabled: values.enabled,
      role: values.role,
    };
    setLoading(true);
    UserSevice.updateUser(payload).then((x: any) => {
      if (x?.code == 200 && x?.message == 'OK') {
        Notification.success({
          content: 'Chỉnh sửa người dùng thành công',
          theme: 'light',
        });
        router.push(`/end-user/user`);
      }
    });
    setLoading(false);
    // onSave && onSave(values);
  };
  useEffect(() => {
    if (!data && !isLoading) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;
  return (
    <div>
      <MainContentWrapper isLoading={isLoading} data={data}>
        <div className="pt-6 px-6 flex flex-col gap-4">
          <UserTabs
            activeKey="edit-information-user"
            beamUsername={beamUsername}
          />
        </div>
        <ContentWrapper pageTitle="Chỉnh sửa người dùng">
          <SpinWrapper spinning={loading}>
            <form onSubmit={handleSubmit(onSubmitValues)}>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    required
                    field="username"
                    label="Tên đăng nhập"
                    component={(props: any) => <Input disabled {...props} />}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    field="fullName"
                    label="Họ và tên"
                    component={(props: any) => <Input {...props} disabled />}
                    errors={errors}
                    control={control}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    field="email"
                    label="Email"
                    component={(props: any) => <Input {...props} disabled />}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    field="code"
                    label="Mã nhân viên"
                    component={(props: any) => <Input {...props} disabled />}
                    errors={errors}
                    control={control}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* <InputWrapper
              field="phone"
              label="Số điện thoại"
              component={(props: any) => <Input {...props} />}
              errors={errors}
              control={control}
            /> */}
                  <InputWrapper
                    required
                    field="enabled"
                    label="Trạng thái"
                    component={(props: any) => (
                      <Select
                        optionList={endUserStatusOptions}
                        {...props}
                        onSelect={(value: any) => {
                          if (value === false) {
                            return setVisible(true);
                          }
                        }}
                      />
                    )}
                    errors={errors}
                    control={control}
                  />
                  <Modal
                    title="Vui lòng nêu lí do chuyển trạng thái hoạt động vào ô bên dưới"
                    visible={visible}
                    afterClose={() => setValue('reason', '')}
                    onOk={() => {
                      setVisible(false);
                      setValue('enabled', false);
                    }}
                    onCancel={() => {
                      setVisible(false);
                      setValue('enabled', true);
                    }}
                    closeOnEsc={true}
                    okText={'Xác nhận'}
                    cancelText={'Huỷ'}
                    okButtonProps={{
                      disabled: watch('reason')?.length > 0 ? false : true,
                    }}
                  >
                    <InputWrapper
                      field="reason"
                      component={(props: any) => (
                        <TextArea
                          maxLength={200}
                          maxCount={200}
                          showCounter
                          showClear
                          {...props}
                        />
                      )}
                      errors={errors}
                      control={control}
                    />
                  </Modal>
                </div>
                <div className="flex gap-4 justify-end">
                  <Button
                    type="primary"
                    onClick={() => router.push(`/end-user/user`)}
                  >
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
          </SpinWrapper>
        </ContentWrapper>
      </MainContentWrapper>
    </div>
  );
};
