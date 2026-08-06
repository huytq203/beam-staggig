import { Select } from '@douyinfe/semi-ui';
import type { SelectProps } from '@douyinfe/semi-ui/lib/es/select';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { CompanyService } from '@services/companies';
import { useMutation, useQuery } from 'react-query';
import { forwardRef, useEffect } from 'react';
import { CampaignService } from '@services/campaigns';
import { ArrayHelper } from '@helpers/array.helper';

interface CompanySelectProps extends SelectProps {
  checkAllCompany?: (isAllCompany: boolean) => void;
  idTypeNotification?: string;
  selectAll?: boolean;
}

export const CompanySelect = forwardRef<any, CompanySelectProps>((props, ref) => {
  const {
    checkAllCompany,
    className,
    disabled = false,
    idTypeNotification = '',
    multiple = false,
    onChange,
    placeholder = 'Chọn doanh nghiệp/Mã DN/MST',
    selectAll = false,
    size = 'default',
    value,
    ...selectProps
  } = props;
  const { data, isLoading } = useQuery(
    ['companies-select'],
    () => CompanyService.getAllCompaniesDropdown({}),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const mutation = useMutation(['company-noti-select'], (id: any) =>
    CampaignService.checkCampaignHaveCompany(id)
  );
  useEffect(() => {
    if (idTypeNotification) {
      mutation.mutate(idTypeNotification);
    }
  }, [idTypeNotification]);
  const getOptions = () => {
    if (!data) return [];
    if (mutation?.data?.data?.companyIds) {
      const checkCompanyHaveCampaign = ArrayHelper.checkArrayElements(
        mutation?.data?.data?.companyIds,
        data
      );
      return checkCompanyHaveCampaign.commonItems.map((x: any, idx: any) => {
        return {
          label: `${x.name} (${x.index}) (${x.taxIdentificationNumber})`,
          value: x.id,
        };
      });
    } else {
      return data?.map((x: any, idx: any) => {
        return {
          label: `${x.name} (${x.index}) (${x.taxIdentificationNumber})`,
          value: x.id,
        };
      });
    }
  };
  useEffect(() => {
    if (!mutation?.data?.data) return;
    const isAllCompany = Boolean(mutation?.data?.data?.isAllCompany);
    checkAllCompany?.(isAllCompany);
  }, [mutation?.data?.data]);
  useEffect(() => {
    if (selectAll && data) {
      const allValues = data.map((x: any) => x.id);
      onChange?.(allValues);
    }
  }, [selectAll, data, onChange]);

  return (
    <>
      <Select
        {...selectProps}
        ref={ref}
        className={className}
        filter={FunctionBase.customSelectFilterOption}
        loading={isLoading}
        disabled={disabled}
        optionList={getOptions()}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        multiple={multiple}
        max={100}
        size={size}
      />
    </>
  );
});
CompanySelect.displayName = 'CompanySelect';
