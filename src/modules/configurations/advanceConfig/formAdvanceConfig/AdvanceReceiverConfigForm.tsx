import { InputWrapper } from '@components/shared';
import { FormActionButton } from '@components/widgets';
import { Checkbox, Radio, RadioGroup } from '@douyinfe/semi-ui';
import ListAccountsCompany from '@modules/companies/accounts/ListAccountsCompany';
import { ConfigurationService } from '@services/configuration';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import ListAllEmpConfig from '../ListAllEmpConfig';
const AdvanceReceiverConfigForm = (props: any) => {
  const { advanceReceiverID, onCancel, onSubmit } = props;
  const router = useRouter();

  const { data, isFetching, isLoading, error, isError } = useQuery(
    ['advance_receiver'],
    () =>
      ConfigurationService.getAdvanceReceiverConfiguration(advanceReceiverID),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const [permissionReceiver, setPermissionReceiver] = useState<any | null>(
    null
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    register,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(CreateCompanyGroupSchema),
    defaultValues: {
      toAccounting: true,
      toBeamAdmin: true,
      toHRAdmin: true,
      receiverType: 0,
      toEmployees: [],
    } as any,
  });

  useEffect(() => {
    if (!isLoading) {
      const employeeIds = data?.data?.toEmployees.map((x: any) => x.id);
      reset({
        ...data?.data,
        toEmployees: employeeIds,
      });
      setPermissionReceiver(data?.data?.receiverType);
    }
  }, [isLoading, isFetching]);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'toEmployees',
    } as any
  );

  const onSelectEmployee = (employeeId: any) => {
    remove();
    append(employeeId);
  };
  const rowSelection = {
    selectedRowKeys: watch('toEmployees'),
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      onSelectEmployee(selectedRowKeys);
    },
  };

  if (isLoading) return <div className="p-4"></div>;

  return (
    <div className="pb-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper
          field="receiverType"
          control={control}
          errors={errors}
          component={(props: any) => (
            <RadioGroup defaultValue={data?.data?.receiverType} {...props}>
              <div className="grid grid-cols-2 gap-4">
                <Radio value={0} onChange={() => setPermissionReceiver(0)}>
                  Theo quyền
                </Radio>
              </div>
              <div className="pb-6">
                <Radio value={1} onChange={() => setPermissionReceiver(1)}>
                  Tuỳ chỉnh
                </Radio>
              </div>
            </RadioGroup>
          )}
        />

        <div>
          {permissionReceiver === 0 && (
            <div className="grid grid-cols-3 gap-4">
              <InputWrapper
                field="toBeamAdmin"
                label="BEAM Admin"
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
                field="toHRAdmin"
                label="HR Admin"
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
                field="toAccounting"
                label="Kế toán"
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
          )}
          {permissionReceiver === 1 && (
            <ListAllEmpConfig rowSelection={rowSelection} />
          )}
        </div>
        <FormActionButton onCancel={onCancel} />
      </form>
    </div>
  );
};

export default AdvanceReceiverConfigForm;
