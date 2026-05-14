import { InputWrapper } from '@components/shared';
import { BaseFilter } from '@constants/models/BaseFilter';
import { Select, Switch } from '@douyinfe/semi-ui';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import ListAccountsCompany from '@modules/companies/accounts/ListAccountsCompany';
import { CompanyService } from '@services/companies';
import { useState } from 'react';
import { useQuery } from 'react-query';

export const CampaignCompanyPickList = (props: any) => {
  const { onSelect, control, errors, watch, remove, disabledPicker } = props;
  const [filter, setFilter] = useState(new BaseFilter());
  const { data, isLoading, isFetching, refetch } = useQuery(
    ['company-data'],
    async () => {
      const response = await CompanyService.getAllCompaniesDropdown({});
      return response;
    },
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const getOptions = () => {
    if (!data) return [];
    return data?.map((x: any, idx: any) => {
      return {
        label: `${x.name}`,
        value: x.id,
      };
    });
  };

  const rowSelection = {
    selectedRowKeys: watch('applyIds'),
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      remove();
      onSelect && onSelect(selectedRowKeys);
    },
    // disabled: true,
    fixed: true,
  };
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-2 gap-4 items-center">
        <InputWrapper
          required
          field="companyEmployeeId"
          label="Doanh nghiệp"
          component={(props: any) => (
            <Select
              disabled={watch('applyAll') == true}
              filter={FunctionBase.customSelectFilterOption}
              loading={isLoading}
              optionList={getOptions()}
              placeholder="Chọn doanh nghiệp/Mã DN/MST"
              // defaultValue={listCompany[0]?.id}
              {...props}
              max={100}
              showClear
            />
          )}
          errors={errors}
          control={control}
        />

        <InputWrapper
          field="applyAll"
          label="Áp dụng cho tất cả"
          component={(props: any) => (
            <Switch
              disabled={disabledPicker}
              checked={props.value}
              {...props}
            />
          )}
          errors={errors}
          control={control}
        />
      </div>
      {watch('companyEmployeeId') && watch('applyAll') == false && (
        <ListAccountsCompany
          companyId={watch('companyEmployeeId')}
          rowSelection={rowSelection}
          hiddenPayLimit={true}
          disabledAccountPicker={disabledPicker}
          hiddenSelection={false}
        />
      )}
    </div>
  );
};
