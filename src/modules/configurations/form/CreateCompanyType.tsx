import { InputWrapper } from '@components/shared';
import { FormActionButton } from '@components/widgets';
import { statusOptionsWithDraf } from '@constants/index';
import {
  Divider,
  Input,
  Modal,
  Notification,
  Popconfirm,
  Select,
  Space,
  Switch,
  TextArea,
} from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { CompanyTypeService } from '@services/companies/companyTypes/company-types.service';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { CreateCompanyTypeSchema } from 'validations/configurations';
const CreateCompanyType = (props: any) => {
  const { onCancel, companyTypeId, isNew, setCheckData } = props;
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['company-type_detail', companyTypeId],
    () => CompanyTypeService.getCompanyType(companyTypeId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const [loading, setLoading] = useState(false);

  const { authCheckByRole } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]);
  const router = useRouter();
  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CreateCompanyTypeSchema),
    defaultValues: {
      name: 0,
      description: '',
      status: 0,
      value: '',
    } as any,
  });

  useEffect(() => {
    if (!isLoading && !isNew) {
      reset(data?.data);
    }
  }, [isLoading, isFetching]);

 const onSubmit = (values: any) => {
    const requestObject = {
      ...values,
      name: values.name,
      description: values.description,
      status: values.status,
      value: values.value,
    };
    setLoading(true);
    CompanyTypeService.saveOrUpdateCompanyType(requestObject)
      .then((response: any) => {
        if (response.code === 200) {
          Notification.success({
            title: 'Thành công',
            content: `${
              isNew ? 'Thêm mới' : 'Cập nhật'
            } cấu hình doanh nghiệp thành công!`,
            duration: 3,
            theme: 'light',
          });
          router.replace(`/configurations/company-type`);
        } else {
          Notification.error({
            title: 'Error',
            content: `${isNew ? 'Thêm mới' : 'Cập nhật'} không thành công!`,
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            required
            field="name"
            label="Chọn loại cấu hình"
            component={(props: any) => (
              <Select optionList={listCompanyPayConfig} {...props} />
            )}
            errors={errors}
            control={control}
          />
          <InputWrapper
            required
            field="value"
            label="Giá trị"
            component={(props: any) => <Input {...props} />}
            errors={errors}
            control={control}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            required
            field="status"
            label="Trạng thái"
            component={(props: any) => (
              <Select optionList={listCompanyTypeStatus} {...props} />
            )}
            errors={errors}
            control={control}
          />
          <InputWrapper
            field="description"
            label="Mô tả"
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
        <div className="grid grid-cols-2 gap-4"></div>
        <div className="flex gap-4 justify-end">
          <FormActionButton onCancel={onCancel} loading={loading} />
        </div>
      </div>
      <Space />
      <Divider dashed />
    </form>
  );
};
const listCompanyPayConfig = [
  { value: 0, label: 'Kì trả lương' },
  { value: 1, label: 'Loại hình trả lương' },
];
const listCompanyTypeStatus = [
  { value: 0, label: 'Phát hành' },
  { value: 1, label: 'Lưu nháp' },
];
export default CreateCompanyType;
