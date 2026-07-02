import { InputWrapper } from '@components/shared';
import { CompanySelect } from '@components/widgets';
import { customerClassification } from '@constants/select-options.constants';
import { IconFilter, IconSearch, IconPlus } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
export const CustomerClassificationListFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      textSearch: '',
      companyIds: '',
      page: 1,
      size: 10,
      classifyCustomers: '',
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      textSearch: '',
    });
  }, []);
  const onSubmitValues = (values: any) => {
    onFilter &&
      onFilter({
        textSearch: values.textSearch.trim(),
        companyIds: values.companyIds,
        classifyCustomers: values.classifyCustomers,
        page: 1,
        size: 10,
      });
    refetch();
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-4 gap-4">
          <InputWrapper
            field="textSearch"
            label="SĐT, Tên khách hàng"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="SĐT, Tên khách hàng"
                size="large"
                {...e}
              />
            )}
          />
          <InputWrapper
            field="companyIds"
            label="Doanh nghiệp"
            control={control}
            errors={errors}
            component={(e: any) => (
              <CompanySelect {...e} multiple={true} filter={true} />
            )}
          />
          <InputWrapper
            field="classifyCustomers"
            label="Phân loại khách hàng"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select
                placeholder="Phân loại khách hàng"
                optionList={customerClassification}
                size="large"
                showClear={false}
                // style={{ width: 370 }}
                {...e}
              />
            )}
          />
          <Button
            icon={<IconFilter />}
            theme="solid"
            type="secondary"
            htmlType="submit"
            className="mt-7"
          >
            Tìm kiếm
          </Button>
        </div>
      </form>
    </>
  );
};
