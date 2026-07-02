import { Input } from '@components/shared';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const ApplyCompanyFilterTermForm = (props: any) => {
  const { onFilter, listCompany, displayEmployeeKey = true, refetch } = props;
  const [disabledEmployeeKey, setDisabledEmployeeKey] = useState(false);
  const [disabledNameKey, setDisabledNameKey] = useState(false);
  const {
    watch,
    control,
    handleSubmit: handleSubmitFilter,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      employeeKeyWord: '',
      page: 1,
      currentPage: 1,
      size: 10,
      sort: ['createdAt,desc'],
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      name: '',
      employeeKeyWord: '',
    });
  }, []);
  useEffect(() => {
    if (watch('name').length > 0) {
      setDisabledEmployeeKey(true);
      setValue('employeeKeyWord', '');
    } else if (watch('employeeKeyWord').length > 0) {
      setValue('name', '');
      setDisabledNameKey(true);
    } else {
      setDisabledNameKey(false);
      setDisabledEmployeeKey(false);
    }
  }, [watch('name'), watch('employeeKeyWord')]);
  const onSubmitValues = (values: any) => {
    onFilter &&
      onFilter({
        ...values,
        name: values.name.toUpperCase().trim(),
        employeeKeyWord: values.employeeKeyWord.toUpperCase().trim(),
      });
  };

  return (
    <>
      <form
        key={1}
        onKeyDown={(e) => {
          e.key === 'Enter' && e.preventDefault();
          e.key === 'Enter' && onSubmitValues(getValues());
        }}
      >
        <div className="flex gap-4 items-center">
          <div className="w-[80%]">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  size="large"
                  prefix={<IconSearch />}
                  showClear
                  disabled={disabledNameKey}
                  autoComplete="off"
                  placeholder="Tên doanh nghiệp/Mã doanh nghiệp/Mã số thuế"
                  {...field}
                />
              )}
            />
          </div>
          <div className="w-[20%]">
            <Button
              icon={<IconFilter />}
              theme="solid"
              type="secondary"
              className="w-full"
              // htmlType="submit"
              onClick={() => onSubmitValues(getValues())}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
