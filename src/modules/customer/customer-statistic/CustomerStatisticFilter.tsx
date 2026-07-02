import { InputWrapper } from '@components/shared';
import { customerClassification } from '@constants/select-options.constants';
import { IconFilter, IconSearch, IconPlus } from '@douyinfe/semi-icons';
import { Button, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
export const CustomerStatisticsFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchWord: '',
      companyIds: '',
      page: 1,
      size: 10,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      searchWord: '',
    });
  }, []);
  const onSubmitValues = (values: any) => {
    // if (values.status === 5) {
    //   delete values.status
    //   return onFilter({
    //     ...values,
    //     name: values.name.trim(),
    //   })
    // }
    return onFilter({
      searchWord: values.searchWord.trim(),
      companyIds: values.companyIds,
      page: 1,
      size: 10,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-3 gap-4">
          <InputWrapper
            field="searchKey"
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
