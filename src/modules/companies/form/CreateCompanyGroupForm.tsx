import { InputNumberByType, InputWrapper } from '@components/shared';
import { FormWrapper } from '@components/widgets/ContentWrapper';
import {
  Input,
  Notification,
  Select,
  Switch,
  TextArea,
} from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { GroupsServices } from '@services/companies/groups/groups.service';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { CreateCompanyGroupSchema } from 'validations/companies';
import { useAuth } from '@contexts/authentication';
import { useRouter } from 'next/router';
import { UserRole } from '@constants/auth.constants';
import { SpinWrapper } from '@components/widgets/ContentWrapper/SpinWrapper';
import { FunctionBase } from '@helpers/fuction-base.helpers';
const CreateCompanyGroupForm = (props: any) => {
  const {
    onCancel,
    companyId,
    groupId,
    isNew,
    currentProfile,
    setCheckData,
    companyData,
  } = props;
  const { payLimitType } = currentProfile;
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.HR_ADMIN,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['group_detail', groupId],
    () => GroupsServices.getGroup(groupId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateCompanyGroupSchema),
    defaultValues: {
      name: '',
      limit: '',
      // payLimitValue: 0,
      payLimitType: payLimitType,
      code: '',
      description: '',
      manageSalaryAdvanceRequest: null,
    },
  });
  useEffect(() => {
    reset({
      manageSalaryAdvanceRequest: isNew
        ? companyData?.manageSalaryAdvanceRequest
        : data?.manageSalaryAdvanceRequest,
    });
  }, []);
  useEffect(() => {
    if (!isLoading && !isNew) {
      reset({
        ...data,
        manageSalaryAdvanceRequest: isNew
          ? companyData?.manageSalaryAdvanceRequest
          : data?.manageSalaryAdvanceRequest,
      });
    }
  }, [isLoading, isFetching]);

  const onSubmitValues = (values: any) => {
    const payload = {
      companyId: companyId,
      ...values,
    };

    setLoading(true);
    GroupsServices.onSaveOrUpdateGroup(payload)
      .then((response: any) => {
        if (response?.message === 'OK') {
          Notification.success({
            title: 'Thành công',
            content: `${
              values?.id ? 'Cập nhật' : 'Tạo mới'
            } nhóm người lao động thành công`,
            duration: 3,
            theme: 'light',
          });
          onCancel();
          setLoading(false);
        } else {
          Notification.error({
            title: 'Thất bại',
            content: `${
              values?.id ? 'Cập nhật' : 'Tạo mới'
            } nhóm người lao động thất bại`,
            duration: 3,
            theme: 'light',
          });
          setLoading(false);
        }
      })
      .catch((e) => {});
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
          onCancel={onCancel}
          onSubmit={handleSubmit(onSubmitValues, (errors) =>
            FunctionBase.scrollToErrorField(errors as any, setFocus)
          )}
          pageTitle={isNew ? 'Thêm mới nhóm' : 'Chỉnh sửa thông tin nhóm'}
          loading={loading}
        >
          <div className="flex flex-col gap-4">
            <InputWrapper
              required
              field="name"
              label="Tên nhóm"
              component={(props: any) => <Input maxLength={100} {...props} />}
              errors={errors}
              control={control}
            />
            <div className="grid grid-cols-2 gap-20">
              <InputWrapper
                required
                field="code"
                label="Mã nhóm"
                component={(props: any) => (
                  <Input maxLength={15} disabled={!isNew} {...props} />
                )}
                errors={errors}
                control={control}
              />
              <div>
                <p className="mb-2">Phê duyệt ứng lương từng lần</p>
                <div className="flex grid-cols-2 gap-10">
                  <InputWrapper
                    // required
                    field="manageSalaryAdvanceRequest"
                    // label="Phê duyệt ứng lương từng lần"
                    component={(props: any) => (
                      <Switch checked={props.value} {...props} />
                    )}
                    errors={errors}
                    control={control}
                  />
                </div>
              </div>
            </div>
            {payLimitType == 1 && (
              <InputWrapper
                field="payLimitSalary"
                label="Hạn mức theo % lương"
                component={(props: any) => (
                  <InputNumberByType
                    maxLength={3}
                    displayType={payLimitType}
                    {...props}
                  />
                )}
                errors={errors}
                control={control}
              />
            )}

            <InputWrapper
              field="description"
              label={'Mô tả'}
              component={(props: any) => (
                <TextArea
                  autosize
                  maxCount={500}
                  maxLength={500}
                  showCounter
                  showClear
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
            <InputWrapper
              field="note"
              label="Ghi chú"
              component={(props: any) => (
                <TextArea
                  autosize
                  maxCount={500}
                  maxLength={500}
                  showCounter
                  showClear
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
          </div>
        </FormWrapper>
      </SpinWrapper>
    </div>
  );
};

export default CreateCompanyGroupForm;
