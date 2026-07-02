import React, { useEffect, useState } from 'react';
import { InputWrapper } from '@components/shared';
import {
  Button,
  Collapse,
  Input,
  Notification,
  Radio,
  RadioGroup,
  Select,
  Switch,
} from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { EnabledStatusSelect } from '../constants';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { CompanySelect, DependentCompanySelect } from '@components/widgets';
import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import { CreateHRAdminAccount } from 'validations/creatAccount.schema';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
export const CreateHRAdminForm = (props: any) => {
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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateHRAdminAccount),
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      code: '',
      enabled: true,
      password: '',
      reWritePassword: '',
      role: 'hr_admin',
      companyIds: companyId ? companyId : '',
      passwordType: 0,
      eligibleCompaniesSwitch: false,
      eligibleCompanies: [],
    },
  });

  useEffect(() => {
    setValue('eligibleCompanies', watch('companyIds'));
  }, [watch('eligibleCompaniesSwitch')]);

  const onSubmitValues = (values: any) => {
    const payload = {
      passwordType: values.passwordType,
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
      companyIds: values.companyIds,
      eligibleCompanies: values.eligibleCompaniesSwitch
        ? values.eligibleCompanies
        : [],
    };
    setLoading(true);
    UserSevice.saveHRAdmin(payload).then((x: any) => {
      if (x?.code == 200 && x?.message == 'OK') {
        Notification.success({
          content: 'Thêm mới HR Admin thành công',
          theme: 'light',
        });
        setLoading(false);
        router.push(`/end-user/hr-admin`);
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
  return (
    <SpinWrapper spinning={loading} size="large">
      <div>
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
                    component={(props: any) => <Input {...props} />}
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
                    field="companyIds"
                    label="Chọn doanh nghiệp"
                    control={control}
                    errors={errors}
                    component={(customProps: any) => (
                      <CompanySelect {...customProps} multiple={true} />
                    )}
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
                  <div>
                    <div className="flex grid-cols-2 gap-10">
                      <InputWrapper
                        field="eligibleCompaniesSwitch"
                        label="Chốt đối soát"
                        component={(props: any) => (
                          <Switch checked={props.value} {...props} />
                        )}
                        errors={errors}
                        control={control}
                      />
                      {watch('eligibleCompaniesSwitch') == true && (
                        <InputWrapper
                          required
                          field="eligibleCompanies"
                          label="Chọn doanh nghiệp"
                          control={control}
                          errors={errors}
                          component={(customProps: any) => (
                            <DependentCompanySelect
                              {...customProps}
                              multiple={true}
                              dependentData={watch('companyIds')}
                              setValue={setValue}
                              watch={watch}
                            />
                          )}
                        />
                      )}
                    </div>
                  </div>
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
                          <Radio value={0}>Gửi link mật khẩu</Radio>
                          {/* <Radio value={1}>Tạo mật khẩu</Radio> */}
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
              <div className="flex gap-4 justify-end mt-5">
                <Button
                  type="primary"
                  onClick={() => router.push(`/end-user/hr-admin`)}
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
      </div>
    </SpinWrapper>
  );
};
