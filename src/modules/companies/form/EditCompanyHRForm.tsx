import React, { useEffect, useState } from 'react';
import { InputWrapper } from '@components/shared';
import {
  Collapse,
  Input,
  Modal,
  Notification,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TabPane,
  Tabs,
  TextArea,
} from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import { CreatePassword, EditAccount } from 'validations/creatAccount.schema';
import { endUserStatusOptions } from '@modules/end-user/constants';
import { useQuery } from 'react-query';
import { FormWrapper } from '@components/widgets';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
export const EditCompanyHRForm = (props: any) => {
  const { onSave, onCancel, companyId, isNew, setCheckData } = props;
  const router = useRouter();
  const [tabKey, setTabKey] = useState(1);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEligibleCompanies, setIsEligibleCompanies] = useState(false);
  const [eligibleCompanies, setEligibleCompanies] = useState<any>([]);
  const slug = router.query.slug as string[];

  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['beam_detail', slug[1]],
    () => UserSevice.getHRAdmin(slug[1]),
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
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(tabKey == 1 ? EditAccount : CreatePassword),
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
      // eligibleCompaniesSwitch: checkIdInEligibleCompanies(),
    } as any,
  });
  const eligibleCompaniesData = data?.eligibleCompanies;
  const checkIdInEligibleCompanies = () => {
    return eligibleCompaniesData?.includes(companyId);
  };
  useEffect(() => {
    if (!isLoading && !isNew) {
      reset({
        ...data,
        // eligibleCompaniesSwitch: checkIdInEligibleCompanies(),
      });
      setIsEligibleCompanies(checkIdInEligibleCompanies());
    }
  }, [isLoading, isFetching]);

  useEffect(() => {
    if (!checkIdInEligibleCompanies() && isEligibleCompanies) {
      setEligibleCompanies([...eligibleCompaniesData, companyId]);
    } else if (checkIdInEligibleCompanies() && !isEligibleCompanies) {
      const filter = eligibleCompaniesData.filter((x: any) => x != companyId);
      setEligibleCompanies(filter);
    } else if (!checkIdInEligibleCompanies() && !isEligibleCompanies) {
      setEligibleCompanies(eligibleCompaniesData);
    } else if (checkIdInEligibleCompanies() && isEligibleCompanies) {
      setEligibleCompanies(eligibleCompaniesData);
    }
  }, [isEligibleCompanies]);
  const onSubmitValues = (values: any) => {
    const payload = {
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
      companyIds: [...data?.companyIds, companyId],
      reason: values.reason,
      eligibleCompanies: eligibleCompanies,
    };
    setLoading(true);
    if (tabKey == 1) {
      UserSevice.updateHRAdmin(payload).then((x: any) => {
        if (x?.code == 200 && x?.message == 'OK') {
          Notification.success({
            content: 'Chỉnh sửa HR Admin thành công',
            theme: 'light',
          });
          onCancel();
        } else {
          Notification.error({
            title: 'Error',
            content: 'Chỉnh sửa HR Admin thất bại!',
            duration: 3,
            theme: 'light',
          });
        }
        setLoading(false);
      });
    } else {
      const payloadPassword = {
        password: values.password,
        reWritePassword: values.reWritePassword,
        userName: values.username,
      };
      if (values.passwordType === 1) {
        UserSevice.resetPassword(payloadPassword).then((x: any) => {
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
        UserSevice.getResetPasswordByLink(values.username).then((x: any) => {
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
      // onSave && onSave(values);
    }
  };
  useEffect(() => {
    if (!data && !isLoading && !isNew) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;
  return (
    <div>
      <SpinWrapper spinning={loading}>
        <FormWrapper
          pageTitle={`Chỉnh sửa thông tin HR Admin`}
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
            <Tabs type="button" onChange={(tab: any) => setTabKey(tab)}>
              <TabPane tab="Thông tin chung" itemKey="1">
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
                      onOk={() => {
                        setVisible(false);
                        setValue('enabled', false);
                      }}
                      afterClose={() => setValue('reason', '')}
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
                    <div className="grid grid-cols-2 gap-4">
                      <InputWrapper
                        field="eligibleCompaniesSwitch"
                        label="Chốt đối soát"
                        component={(props: any) => (
                          <Switch
                            checked={isEligibleCompanies}
                            onChange={() =>
                              setIsEligibleCompanies(!isEligibleCompanies)
                            }
                          />
                        )}
                        errors={errors}
                        control={control}
                      />
                    </div>
                  </div>
                </Collapse.Panel>
              </TabPane>
              <TabPane tab="Đổi mật khẩu" itemKey="2">
                <Collapse.Panel header="ĐỔI MẬT KHẨU" itemKey="createPassword">
                  <div>
                    {/* <h1>Tạo mật khẩu cho {watch('username')}</h1> */}
                    <div className="my-5">
                      <InputWrapper
                        field="passwordType"
                        component={(props: any) => (
                          <RadioGroup name="create-password" {...props}>
                            <Radio value={0}>Gửi link mật khẩu</Radio>
                            <Radio value={1}>Đổi mật khẩu</Radio>
                          </RadioGroup>
                        )}
                        errors={errors}
                        control={control}
                      />
                    </div>
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
                </Collapse.Panel>
              </TabPane>
            </Tabs>
          </Collapse>
        </FormWrapper>
      </SpinWrapper>
    </div>
  );
};
