import { InputWrapper } from '@components/shared';
import { FormActionButton } from '@components/widgets';
import { simpleStatusOptions, statusOptionsWithDraf } from '@constants/index';
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
import { CampaignService } from '@services/campaigns';
import { CreateCampaignSchema } from 'validations/CreateCampaignSchema.schema';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { CreateCampaignTypeSchema } from 'validations/configurations';
export const CreateCampaignTypeForm = (props: any) => {
  const { onCancel, campaignTypeId, isNew, setCheckData } = props;
  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['campaign-type_detail', campaignTypeId],
    () => CampaignService.getDetailCampaignTypes(campaignTypeId),
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
    resolver: yupResolver(CreateCampaignTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 0,
      enabled: true,
    } as any,
  });

  useEffect(() => {
    if (!isLoading && !isNew) {
      reset({
        ...data,
        status: data?.status ?? 0,
      });
    }
  }, [isLoading, isFetching]);

  const onSubmit = (values: any) => {
    const requestObject = {
      ...values,
      name: values.name,
      description: values.description,
      status: values.status,
      enabled: values.enabled,
    };
    setLoading(true);
    CampaignService.addOrUpdateCampaignType(requestObject)
      .then((response: any) => {
        if (response.code === 200) {
          Notification.success({
            title: 'Thành công',
            content: `${
              isNew ? 'Thêm mới' : 'Cập nhật'
            } loại chiến dịch thành công!`,
            duration: 3,
            theme: 'light',
          });
          router.replace(`/configurations/campaign-type`);
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
            label="Tên loại chiến dịch"
            component={(props: any) => <Input {...props} />}
            errors={errors}
            control={control}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
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
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            field="status"
            label="Trạng thái"
            component={(props: any) => (
              <Select
                optionList={
                  isNew || (!isNew && getValues('status') === 2)
                    ? statusOptionsWithDraf
                    : simpleStatusOptions
                }
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
        </div>
        <div className="flex gap-4 justify-end">
          <FormActionButton onCancel={onCancel} loading={loading} />
        </div>
      </div>
      <Space />
      <Divider dashed />
    </form>
  );
};
