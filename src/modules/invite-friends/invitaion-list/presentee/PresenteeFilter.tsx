import { InputWrapper } from '@components/shared';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, DatePicker, Input, Select } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
export const PresenteeFilter = (props: any) => {
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
    return onFilter({
      searchWord: values.searchWord.trim(),
      page: 1,
      size: 10,
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            field="searchWord"
            label="Người được giới thiệu"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="SĐT người được giới thiệu"
                size="large"
                {...e}
              />
            )}
          />
          {/* <InputWrapper
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
                    label: 'Ngày chi thưởng',
                  },
                  {
                    value: '',
                    label: 'Ngày ứng cập nhật',
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
                type="dateRange"
                insetInput
                format="dd/MM/yyyy"
                {...e}
              />
            )}
          />
          <InputWrapper
            field="searchKey"
            label="Trạng thái"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Select
                placeholder="Trạng thái"
                optionList={[
                  {
                    value: '',
                    label: 'Tất cả',
                  },
                  {
                    value: '',
                    label: 'Đã chi thưởng',
                  },
                  {
                    value: '',
                    label: 'Chưa chi thưởng',
                  },
                ]}
                size="large"
                showClear={false}
                // style={{ width: 370 }}
                {...e}
              />
            )}
          /> */}
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
