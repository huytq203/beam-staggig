import { Select } from '@douyinfe/semi-ui';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { CompanyService } from '@services/companies';
import { useMutation, useQuery } from 'react-query';
import { useEffect } from 'react';
import { CampaignService } from '@services/campaigns';
import { ArrayHelper } from '@helpers/array.helper';

export const CompanySelect = (props: any) => {
  const {
    onChange,
    value,
    multiple = false,
    idTypeNotification = '',
    disabled = false,
    selectAll = false,
    checkAllCompany,
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
    checkAllCompany(isAllCompany);
  }, [mutation?.data?.data]);
  useEffect(() => {
    if (selectAll && data) {
      const allValues = data.map((x: any) => x.id);
      onChange(allValues);
    }
  }, [selectAll, data, onChange]);

  return (
    <>
      <Select
        filter={FunctionBase.customSelectFilterOption}
        loading={isLoading}
        disabled={disabled}
        optionList={getOptions()}
        value={value}
        placeholder="Chọn doanh nghiệp/Mã DN/MST"
        onChange={(e: any) => onChange(e)}
        multiple={multiple}
        max={100}
        size="default"
      />
    </>
  );
};
