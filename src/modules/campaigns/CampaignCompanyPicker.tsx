import { AppPagination, InputWrapper } from '@components/shared';
import { Button, Input, Switch, Table } from '@douyinfe/semi-ui';
import { CompanyService } from '@services/companies';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { IconSearch, IconFilter } from '@douyinfe/semi-icons';

export const CampaignCompanyPicker = (props: any) => {
  const { onSelect, control, errors, watch, remove, disabledPicker } = props;
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
    sort: ['createdAt', 'desc'],
  });
  const {
    handleSubmit: handleSubmitFilter,
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      nameFilter: '',
      page: 1,
      currentPage: 1,
      size: 10,
      sort: ['createdAt,desc'],
    },
  });
  const { data, isLoading, refetch } = useQuery(
    ['company-selection-list', filter],
    () => CompanyService.getAll(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const onRowSelect = (e: any) => {
    onSelect && onSelect(e);
  };

  const columns = [
    {
      title: 'Tên doanh nghiệp',
      dataIndex: 'name',
      ellipsis: true,
    },
  ];

  const rowSelection = {
    selectedRowKeys: watch('applyIds'),
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      remove();
      onRowSelect(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: disabledPicker,
      // name: record.name,
    }),
  };
  const onSubmitValues = (values: any) => {
    setFilter({
      ...getValues(),
      name: values?.toUpperCase().trim(),
    });
  };
  return (
    <div className="grid grid-cols-1 gap-4">
      <InputWrapper
        field="applyAll"
        label="Áp dụng cho tất cả doanh nghiệp"
        component={(props: any) => (
          <Switch disabled={disabledPicker} checked={props.value} {...props} />
        )}
        errors={errors}
        control={control}
      />
      {watch('applyAll') == false && (
        <div>
          <form
            onKeyDown={(e) => {
              e.key === 'Enter' && e.preventDefault();
              e.key === 'Enter' && onSubmitValues(watch('nameFilter'));
            }}
          >
            <div className="flex gap-4 items-center">
              <div className="w-[70%]">
                <Controller
                  name="nameFilter"
                  control={control}
                  render={({ field }) => (
                    <Input
                      size="large"
                      prefix={<IconSearch />}
                      showClear
                      autoComplete="off"
                      placeholder="Tên doanh nghiệp"
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="w-[30%]">
                <Button
                  icon={<IconFilter />}
                  theme="solid"
                  type="secondary"
                  className="w-full"
                  // htmlType="submit"
                  onClick={() => onSubmitValues(watch('nameFilter'))}
                >
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </form>
          <Table
            key="company"
            size="small"
            loading={isLoading}
            columns={columns}
            dataSource={data?.content ?? []}
            renderPagination={(e: any) => {
              return (
                <div className="py-2 w-full flex justify-end">
                  <AppPagination
                    {...data}
                    onChange={(e: any) => {
                      setFilter({
                        ...filter,
                        page: e,
                      });
                    }}
                  />
                </div>
              );
            }}
            rowKey="id"
            rowSelection={rowSelection}
          />
        </div>
      )}
    </div>
  );
};
