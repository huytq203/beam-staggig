import { useForm } from 'react-hook-form';
import { InputWrapper } from '@components/shared';
import { FormActionButton } from '@components/widgets';
import { TermFormTypeService } from '@services/termform';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Modal, Notification, Select, Switch } from '@douyinfe/semi-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { BeamEditor } from '@components/shared/RichText/NanoEditor';
import { CreateTermFom } from 'validations/CreateTermFormSchema.schema';
import { PreviewMobile } from '@components/shared/PreviewMobile/PreviewMobile';

const CreateTermForm = (props: any) => {
  const { onCancel, termformId, isNew, setCheckData } = props;

  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['term_form_detail', termformId],
    () => TermFormTypeService.getTermForm(termformId),
    {
      enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

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
    resolver: yupResolver(CreateTermFom),
    defaultValues: {
      name: '',
      type: 'PRIVACY_POLICY',
      status: 'ACTIVE',
      isDefault: false,
      statusTermForm: 'ON',
      content: '',
    } as any,
  });

  useEffect(() => {
    if (!isLoading && !isNew) {
      reset(data?.data);
    }
  }, [isLoading, isFetching]);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = (values: any) => {
    const requestObject = {
      ...values,
      name: values.name,
      type: values.type,
      status: values.status,
    };
    setLoading(true);
    TermFormTypeService.saveOrUpdateTermForm(requestObject)
      .then((response: any) => {
        if (response.code === 200) {
          Notification.success({
            title: 'Thành công',
            content: `${
              isNew ? 'Thêm mới' : 'Cập nhật'
            } biểu mẫu điều khoản thành công!`,
            duration: 3,
            theme: 'light',
          });
          router.replace(`/configurations/term-form`);
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

  const isDisabled = !isNew && data?.data?.status === 'ACTIVE';

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            required
            field="type"
            label="Loại biểu mẫu"
            component={(props: any) => (
              <Select optionList={listTermType} {...props} />
            )}
            errors={errors}
            control={control}
          />
          <InputWrapper
            required
            field="name"
            label="Tên biểu mẫu"
            component={(props: any) => <Input {...props} />}
            errors={errors}
            control={control}
          />
        </div>
        <div>
          <InputWrapper
            required
            field="content"
            label="Nội dung"
            component={(props: any) => (
              <BeamEditor onChange={props.onChange} value={props.value} />
            )}
            errors={errors}
            control={control}
          />
        </div>
        <div className="grid grid-cols-2 gap-9">
          <InputWrapper
            required
            field="status"
            label="Trạng thái"
            component={(props: any) => (
              <Select
                optionList={listTermFormStatus}
                {...props}
                disabled={isDisabled}
              />
            )}
            errors={errors}
            control={control}
          />

          <div>
            <InputWrapper
              field="isDefault"
              label="Mặc định"
              component={(props: any) => (
                <Switch onChange={props.onChange} checked={props.value} />
              )}
              errors={errors}
              control={control}
            />
            <p>Các cấu hình mặc định được áp dụng cho toàn bộ doanh nghiệp</p>
          </div>
        </div>
      </div>
      <div>
        <p className="font-bold">Hướng dẫn</p>
        <p> 1. Nhập nội dung của biểu mẫu điều khoản vào ô nội dung</p>
        <p>
          {' '}
          2. Bổ sung thêm các tham số vào sau các trường thông tin cần cung cấp.
        </p>
        <p>Tên : @name</p>
        <p>Nơi cấp CCCD : @identificationAddress</p>
        <p>CCCD : @identityNumber</p>
        <p>Ngày cấp CCCD: @identificationProvideDay</p>
        <p>Số điện thoại: @phoneNumber</p>
        <p>Mã nhân viên: @employeeCode</p>
        <p>Emai: @email</p>
        <p>Ngày sinh: @birthday</p>
        <p>Tên công ty: @company</p>
        <p>Số tài khoản ngân hàng: @bankNumber</p>
        <p>Tên ngân hàng: @bankName</p>
      </div>
      <PreviewMobile type={watch('type')} content={watch('content')} />
      <div className="flex gap-4 justify-end mt-5">
        <FormActionButton onCancel={onCancel} isLoading={isLoading} />
      </div>
    </form>
  );
};

export const listTermType = [
  { value: 'PRIVACY_POLICY', label: 'Chính sách bảo mật' },
  { value: 'TERMS_OF_USE', label: 'Điều khoản sử dụng' },
  {
    value: 'PERSONAL_DATA_PROTECTION_POLICY',
    label: 'Chính sách bảo vệ dữ liệu cá nhân',
  },
  {
    value: 'AGREEMENT_TO_USE_THE_SERVICE',
    label: 'Thỏa thuận sử dụng dịch vụ ứng lương',
  },
];

const listTermFormStatus = [
  { value: 'ACTIVE', label: 'Phát hành' },
  { value: 'DRAFT', label: 'Lưu nháp' },
];

export default CreateTermForm;
