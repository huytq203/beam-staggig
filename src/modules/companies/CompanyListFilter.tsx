import { Input } from '@components/shared';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, Select } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const CompanyListFilter = (props: any) => {
  const { onFilter, listCompany, displayEmployeeKey = true, refetch } = props;
  const [disabledEmployeeKey, setDisabledEmployeeKey] = useState(false);
  const [disabledNameKey, setDisabledNameKey] = useState(false);

  const router = useRouter();
  const { name: nameRouter, employeeKeyWord: employeeKeyWordRouter } =
    router.query;

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
      enabled: '',
      blocked: '',
      page: 1,
      currentPage: 1,
      size: 10,
      sort: ['createdAt,desc'],
    },
  });
  useEffect(() => {
    reset({
      ...getValues(),
      name: String(nameRouter || ''),
      employeeKeyWord: String(employeeKeyWordRouter || ''),
    });
  }, [nameRouter, employeeKeyWordRouter]);
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

  const convertToBoolean = (value: any) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return ''; 
  };

  const onSubmitValues = (values: any) => {
    router.push({
      pathname: router.pathname,
      // Thêm search query vào URL
      query: {
        ...router.query,
        page: 1,
        name: values.name.trim(),
        employeeKeyWord: values.employeeKeyWord.trim(),
        enabled: convertToBoolean(values.enabled),
        blocked: convertToBoolean(values.blocked),
      },
    });
    onFilter &&
      onFilter({
        ...values,
        page: 1,
        name: values.name.toUpperCase().trim(),
        employeeKeyWord: values.employeeKeyWord.toUpperCase().trim(),
        enabled: convertToBoolean(values.enabled), 
        blocked: convertToBoolean(values.blocked),
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
        <div className="flex flex-col gap-4">
           <div className="flex gap-4 items-center">
             <div className="w-[50%]">
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

        {displayEmployeeKey && (
         <div className="w-[50%]">
            <Controller
               name="employeeKeyWord"
               control={control}
               render={({ field }) => (
              <Input
                size="large"
                prefix={<IconSearch />}
                showClear
                disabled={disabledEmployeeKey}
                autoComplete="off"
                placeholder="Mã nhân viên/SĐT nhân viên/CCCD/Email"
                {...field}
              />
            )}
             />
         </div>
       )}
       </div>
        <div className="flex gap-4 items-end">
          <div className="w-[40%]">
            <p className="mb-1">Trạng thái hoạt động</p>
             <Controller
               name="enabled"
               control={control}
               render={({ field }) => (
               <Select
                 {...field}
                 className="w-full"
                 size="large"
                 placeholder="Enabled"
                 optionList={[
                    { label: 'Tất cả', value: '' },
                    { label: 'Hoạt Động', value: 'true' },
                    { label: 'Không Hoạt Động', value: 'false' },
                 ]}
               />
               )}
             />
         </div>

        <div className="w-[40%]">
           <p className="mb-1">Trạng thái ứng lương</p>
            <Controller
              name="blocked"
              control={control}
              render={({ field }) => (
              <Select
                {...field}
                className="w-full"
                size="large"
                placeholder="Blocked"
                optionList={[
                  { label: 'Tất cả', value: '' },
                  { label: 'Khóa Ứng Lương', value: 'true' },
                  { label: 'Mở Ứng Lương', value: 'false' },
                ]}
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
            onClick={() => onSubmitValues(getValues())}
            >
             Tìm kiếm
            </Button>
          </div>
        </div>
       </div>
      </form>
    </>
  );
};
