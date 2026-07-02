import { InputWrapper } from '@components/shared';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { Button, Input } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ExportProcedureButton } from './ExportProcedure';
export const ProcedureFilter = (props: any) => {
  const { onFilter, refetch } = props;
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchKeyword: '',
      page: 1,
      size: 10,
    },
  });

  useEffect(() => {
    reset({
      ...getValues(),
      searchKeyword: '',
    });
  }, []);
  const onSubmitValues = (values: any) => {
    onFilter({
      searchKeyword: values.searchKeyword.trim(),
      page: 1,
      size: 10,
    });
    refetch();
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValues)}>
        <div className="grid grid-cols-3 gap-4">
          <InputWrapper
            field="searchKeyword"
            control={control}
            errors={errors}
            component={(e: any) => (
              <Input
                prefix={<IconSearch />}
                showClear
                autoComplete="off"
                placeholder="Số điện thoại"
                size="large"
                {...e}
              />
            )}
          />
          <Button
            icon={<IconFilter />}
            theme="solid"
            type="secondary"
            htmlType="submit"
          >
            Tìm kiếm
          </Button>
          <ExportProcedureButton filterExport={getValues()} />
        </div>
      </form>
    </>
  );
};
