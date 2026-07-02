import React, { useState } from 'react';
import { InputWrapper } from '@components/shared';
import {
  Button,
  Collapse,
  Input,
  Notification,
  Radio,
  RadioGroup,
  Select,
} from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { EnabledStatusSelect } from '../constants';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import { CreateUserAccount } from 'validations/creatAccount.schema';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
export const CreateUserForm = (props: any) => {
  const { onSave, onCancel, companyId, groupId, isNew, currentProfile } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { authCheckByRole } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateUserAccount),
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      code: '',
      enabled: true,
      role: 'user',
      companyId: companyId ? companyId : '',
      password: '',
      passwordType: 1,
    },
  });

  // useEffect(() => {
  //   if (!isLoading && !isNew) {
  //     reset(data);
  //   }
  // }, [isLoading, isFetching]);

  const onSubmitValues = (values: any) => {
    const payload = {
      passwordType: values.passwordType,
      password: {
        password: values.password,
        reWritePassword: values.reWritePassword,
      },
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
    };
    setLoading(false);
    UserSevice.saveUser(payload).then((x: any) => {
      if (x?.code == 200 && x?.message == 'OK') {
        Notification.success({
          content: 'Thêm mới người dùng thành công',
          theme: 'light',
        });
        router.push(`/end-user/user`);
      }
    });
    onSave && onSave(values);
    setLoading(false);
  };
  return (
    <div>
      <SpinWrapper spinning={loading}>
        <form onSubmit={handleSubmit(onSubmitValues)}>
          <div className="flex flex-col gap-4">
            <Collapse
              expandIcon={<IconPlus />}
              collapseIcon={<IconMinus />}
              className="p-0"
              defaultActiveKey={['information', 'createPassword']}
            >
              <Collapse.Panel
                header="THÔNG TIN TÀI KHOẢN"
                itemKey="information"
              >
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    required
                    field="username"
                    label="Tên đăng nhập"
                    component={(props: any) => (
                      <Input autoComplete="off" {...props} />
                    )}
                    errors={errors}
                    control={control}
                  />
                  <InputWrapper
                    field="fullName"
                    label="Biệt danh"
                    component={(props: any) => <Input {...props} />}
                    errors={errors}
                    control={control}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper
                    field="email"
                    label="Email"
                    component={(props: any) => <Input {...props} />}
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
                    field="enabled"
                    label="Trạng thái"
                    component={(props: any) => <EnabledStatusSelect {...props} />}
                    errors={errors}
                    control={control}
                  />
                </div>
              </Collapse.Panel>
              <Collapse.Panel header="TẠO MẬT KHẨU" itemKey="createPassword">
                <div>
                  {/* <h1>Tạo mật khẩu cho {watch('username')}</h1> */}
                  <div className="my-5">
                    <InputWrapper
                      field="passwordType"
                      component={(props: any) => (
                        <RadioGroup name="create-password" {...props}>
                          <Radio value={0}>Gửi mật khẩu qua SMS</Radio>
                          <Radio value={1}>Tạo mật khẩu</Radio>
                        </RadioGroup>
                      )}
                      errors={errors}
                      control={control}
                    />
                    {watch('passwordType') == 1 && (
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <InputWrapper
                          required
                          field="password"
                          label="Mật khẩu mới"
                          component={(props: any) => (
                            <Input mode="password" {...props} />
                          )}
                          errors={errors}
                          control={control}
                        />
                        <InputWrapper
                          required
                          field="reWritePassword"
                          label="Nhập lại mật khẩu mới"
                          component={(props: any) => (
                            <Input mode="password" {...props} />
                          )}
                          errors={errors}
                          control={control}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Collapse.Panel>
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
            </Collapse>
          </div>
        </form>
      </SpinWrapper>
    </div>
  );
};
