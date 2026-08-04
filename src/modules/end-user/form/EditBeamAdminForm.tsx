import React, { useState } from 'react';
import { InputWrapper } from '@components/shared';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { EditAccount } from 'validations/creatAccount.schema';
import { useQuery } from 'react-query';
import { RolesSelect } from '@components/widgets/Select/RolesSelect';
import {
  AccountLockedStatusSelect,
  EnabledStatusSelect,
} from '../constants';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
export const EditBeamAdminForm = (props: any) => {
  const { beamUsername, setCheckData } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['beam_detail', beamUsername],
    () => UserSevice.getAdmin(beamUsername),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const { authCheckByRole } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditAccount),
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      code: '',
      enabled: true,
      accountLocked: false,
    } as any,
  });

  useEffect(() => {
    if (!isLoading) {
      reset({
        ...data,
        reason: '',
      });
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
      accountLocked:
        data?.accountLocked === true ? values.accountLocked === true : false,
      role: values.role,
      reason: values.reason,
    };
    setLoading(true);
    UserSevice.updateAdmin(payload).then((x: any) => {
      if (x?.code == 200 && x?.message == 'OK') {
        Notification.success({
          content: 'Chỉnh sửa quản trị viên thành công',
          theme: 'light',
        });
        router.push(`/end-user/beam-admin`);
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
                component={(props: any) => <Input {...props} />}
                errors={errors}
                control={control}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper
                required
                field="email"
                label="Email"
                component={(props: any) => <Input disabled {...props} />}
                errors={errors}
                control={control}
              />
              <InputWrapper
                field="code"
                label="Mã nhân viên"
                component={(props: any) => <Input {...props} />}
                errors={errors}
                control={control}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper
                field="phone"
                label="Số điện thoại"
                component={(props: any) => <Input {...props} />}
                errors={errors}
                control={control}
              />
              <InputWrapper
                required
                field="role"
                label="Phân quyền"
                component={(props: any) => <RolesSelect {...props} />}
                errors={errors}
                control={control}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputWrapper
                required
                field="enabled"
                label="Trạng thái"
                component={(props: any) => <EnabledStatusSelect {...props} />}
                errors={errors}
                control={control}
              />
              <InputWrapper
                field="accountLocked"
                label="Trạng thái tạm khóa"
                component={(props: any) => (
                  <AccountLockedStatusSelect {...props} />
                )}
                errors={errors}
                control={control}
              />
              <Modal
                title="Vui lòng nêu lí do chuyển trạng thái hoạt động vào ô bên dưới"
                visible={visible}
                // afterClose={() => setValue('reason', '')}
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
                onClick={() => router.push(`/end-user/beam-admin`)}
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
    </div>
  );
};
