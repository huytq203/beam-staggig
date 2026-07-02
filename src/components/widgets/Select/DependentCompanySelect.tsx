import { Select, Tag } from '@douyinfe/semi-ui';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { CompanyService } from '@services/companies';
import { forwardRef, useEffect } from 'react';
import { useQuery } from 'react-query';

export const DependentCompanySelect = forwardRef<any, any>((props: any, ref: any) => {
  const {
    onChange,
    value,
    multiple = false,
    disabled = false,
    dependentData = [],
    isFetching,
    watch,
    setValue,
  } = props;
  const { data, isLoading } = useQuery(
    ['companies-select'],
    () => CompanyService.getAllCompaniesDropdown({}),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const getOptions = () => {
    if (!data || dependentData.length <= 0) return [];
    const convertData = data.filter((x: any) => dependentData.includes(x.id));
    return convertData?.map((x: any, idx: any) => {
      return {
        label: `${x.name} (${x.index}) (${x.taxIdentificationNumber})`,
        value: x.id,
      };
    });
  };
  useEffect(() => {
    if (watch('eligibleCompanies').length > 0) {
      if (dependentData.length < value.length) {
        onChange(dependentData);
      }

      //eligibleCompanies chứ phần tử mà dependentData không có
      // => xoá phần tử đó khỏi eligibleCompanies
      const removeCompany = watch('eligibleCompanies').filter((x: any) =>
        dependentData.includes(x)
      );
      setValue('eligibleCompanies', removeCompany);
    }
  }, [dependentData]);
  return (
    <>
      <Select
        ref={ref}
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
        className="w-[350px]"
        showClear
      />
    </>
  );
});
DependentCompanySelect.displayName = 'DependentCompanySelect';
