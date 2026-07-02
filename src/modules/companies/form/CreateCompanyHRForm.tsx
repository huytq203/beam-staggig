import React, { useEffect, useState } from 'react';
import { InputWrapper } from '@components/shared';
import {
  Collapse,
  Input,
  Notification,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from '@douyinfe/semi-ui';
import { useForm } from 'react-hook-form';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import { EnabledStatusSelect } from '@modules/end-user/constants';
import { useQuery } from 'react-query';
import { FormWrapper } from '@components/widgets';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditAccount } from 'validations/creatAccount.schema';
export const CreateCompanyHRForm = (props: any) => {
  const { onSave, onCancel, companyId, isNew, setCheckData } = props;
  const router = useRouter();
  const [createPassword, setCreatePassword] = useState(0);
  const [loading, setLoading] = useState(false);
  const slug = router.query.slug as string[];

  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['beam_detail', slug[1]],
    () => UserSevice.getAdmin(slug[1]),
    {
      enabled: !isNew,
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
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditAccount),
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      code: '',
      password: '',
      reWritePassword: '',
      enabled: true,
      role: 'hr_admin',
      companyId: companyId ? companyId : '',
      passwordType: 0,
    },
  });

  useEffect(() => {
    if (!isLoading && !isNew) {
      reset(data);
    }
  }, [isLoading, isFetching]);
  const onSubmitValues = (values: any) => {
    const payload = {
      passwordType: createPassword,
      password: {
        password: values.password.trim(),
        reWritePassword: values.reWritePassword.trim(),
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
      role: values.role,
      companyIds: [companyId],
      eligibleCompanies: values.eligibleCompanies ? [companyId] : [],
    };
    // debugger;
    setLoading(true);
    UserSevice.saveHRAdmin(payload).then((response: any) => {
      if (response?.code == 200 && response?.message == 'OK') {
        Notification.success({
          content: 'Thêm mới HR Admin thành công',
          theme: 'light',
        });
        setLoading(false);
        onCancel();
      } else {
        Notification.error({
          title: 'Error',
          content: 'Thêm mới HR Admin thất bại!',
          duration: 3,
          theme: 'light',
        });
        setLoading(false);
      }
    });
    // onSave && onSave(values);
  };
  useEffect(() => {
    if (!data && !isLoading && !isNew) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;
  return (
    <SpinWrapper spinning={loading}>
      <div>
        <FormWrapper
          pageTitle={`${isNew ? 'Thêm mới' : 'Chỉnh sửa'} thông tin HR Admin`}
          onCancel={onCancel}
          onSubmit={handleSubmit(onSubmitValues, (errors) =>
            FunctionBase.scrollToErrorField(errors as any, setFocus)
          )}
          loading={loading}
        >
          <Collapse
            expandIcon={<IconPlus />}
            collapseIcon={<IconMinus />}
            className="p-0"
            defaultActiveKey={['information', 'createPassword']}
          >
            <Collapse.Panel header="THÔNG TIN TÀI KHOẢN" itemKey="information">
              <div className="grid grid-cols-2 gap-4">
                <InputWrapper
                  required
                  field="username"
                  label="Tên đăng nhập"
                  component={(props: any) => (
                    <Input disabled={!isNew} {...props} />
                  )}
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
                  component={(props: any) => (
                    <Input disabled={!isNew} {...props} />
                  )}
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
              <div className="grid grid-cols-2 gap-4">
                <InputWrapper
                  field="eligibleCompanies"
                  label="Chốt đối soát"
                  component={(props: any) => <Switch {...props} />}
                  errors={errors}
                  control={control}
                />
              </div>
            </Collapse.Panel>
            {isNew && (
              <Collapse.Panel header="TẠO MẬT KHẨU" itemKey="createPassword">
                <div>
                  {/* <h1>Tạo mật khẩu cho {watch('username')}</h1> */}
                  <div className="my-5">
                    <RadioGroup
                      onChange={(e: any) => setCreatePassword(e.target.value)}
                      // value={updateForNewPeriod}
                      name="create-password"
                      defaultValue={0}
                    >
                      <Radio value={0}>Gửi link mật khẩu</Radio>
                      {/* <Radio value={1}>Tạo mật khẩu</Radio> */}
                    </RadioGroup>
                    {createPassword == 1 && (
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
            )}
          </Collapse>
        </FormWrapper>
      </div>
    </SpinWrapper>
  );
};
