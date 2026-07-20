import { InputNumberByType, InputWrapper } from '@components/shared';
import { FormActionButton } from '@components/widgets';
import { Checkbox, Select } from '@douyinfe/semi-ui';
import { ConfigurationService } from '@services/configuration';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
const BaseAdvanceConfigForm = (props: any) => {
  const { advanceId, onCancel, onSubmit, type, displayType } = props;

  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['base-Advnace-Config'],
    () => ConfigurationService.getAdvanceConfigurationByRecord(type, advanceId),
    {
      // enabled: !isNew,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    // resolver: yupResolver(CreateCompanyGroupSchema),
    defaultValues: {} as any,
  });
  useEffect(() => {
    if (!isLoading) {
      reset(data[0]);
    }
  }, [isLoading, isFetching]);

  return (
    <div className="pb-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper
          required
          field="threshold"
          label="Ngưỡng cảnh báo"
          component={(props: any) => (
            <InputNumberByType displayType={displayType} {...props} />
          )}
          errors={errors}
          control={control}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            field="remind"
            label="Nhắc lại cảnh báo"
            component={(props: any) => (
              <Checkbox
                {...props}
                checked={props.value}
                onChange={(e) => props.onChange(!e.target.value)}
              />
            )}
            errors={errors}
            control={control}
          />
          <InputWrapper
            field="sms"
            label="SMS"
            component={(props: any) => (
              <Checkbox
                {...props}
                checked={props.value}
                onChange={(e) => props.onChange(!e.target.value)}
              />
            )}
            errors={errors}
            control={control}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            field="email"
            label="Email"
            component={(props: any) => (
              <Checkbox
                {...props}
                checked={props.value}
                onChange={(e) => props.onChange(!e.target.value)}
              />
            )}
            errors={errors}
            control={control}
          />
          <InputWrapper
            field="notification"
            label="Thông báo"
            component={(props: any) => (
              <Checkbox
                {...props}
                checked={props.value}
                onChange={(e) => props.onChange(!e.target.value)}
              />
            )}
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
              <Select
                placeholder="Chọn trạng thái"
                optionList={statusConfigAdvance}
                {...props}
              />
            )}
            errors={errors}
            control={control}
          />
        </div>
        <FormActionButton onCancel={onCancel} loading={isSubmitting} />
      </form>
    </div>
  );
};

const statusConfigAdvance = [
  {
    value: true,
    label: 'Hoạt động',
  },
  {
    value: false,
    label: 'Không hoạt động',
  },
];

export default BaseAdvanceConfigForm;
