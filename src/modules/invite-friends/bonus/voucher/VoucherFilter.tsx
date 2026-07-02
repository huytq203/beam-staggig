import { InputWrapper } from '@components/shared';
import { CompanySelect } from '@components/widgets';
import { IconFilter, IconSearch, IconPlus } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
export const VoucherFilter = (props: any) => {
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
      dateRanges: ['', ''],
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
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            field="searchKey"
            label="Người giới thiệu"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="SĐT, tên người giới thiệu"
                size="large"
                {...e}
              />
            )}
          />
          <InputWrapper
            field="companyIds"
            label="Doanh nghiệp người giới thiệu"
            control={control}
            errors={errors}
            component={(e: any) => (
              <CompanySelect {...e} multiple={true} filter={true} />
            )}
          />
          <InputWrapper
            field="searchKey"
            label="Xem theo ngày"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select
                placeholder="Xem theo ngày"
                optionList={[
                  {
                    value: '',
                    label: 'Tất cả',
                  },
                  {
                    value: '',
                    label: 'Ngày khởi tạo',
                  },
                  {
                    value: '',
                    label: 'Ngày cập nhật',
                  },
                  {
                    value: '',
                    label: 'Ngày chi thưởng',
                  },
                ]}
                size="large"
                showClear={false}
                // style={{ width: 370 }}
                {...e}
              />
            )}
          />
          <InputWrapper
            field="dateRanges"
            label="Lựa chọn thời gian"
            control={control}
            errors={errors}
            component={(e: any) => (
              <DatePicker
                size="large"
                className="w-full"
                type="dateTimeRange"
                insetInput
                format="dd/MM/yyyy HH:mm:ss"
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
