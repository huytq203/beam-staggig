import { Select } from '@douyinfe/semi-ui';
import { CompanyTypeService } from '@services/companies/companyTypes/company-types.service';
import { useQuery } from 'react-query';

export const SelectCompanyType = (props: any) => {
  // const { data, isLoading, refetch } = useQuery(['company-type-selection-list'], () =>
  //   CompanyTypeService.getCompanyTypes({})
  // );
  // const getSelectOptions = () => {
  //   if (isLoading || !data) return [];
  //   return data.content.map((x: any) => {
  //     return {
  //       value: x.id,
  //       label: x.name,
  //     };
  //   });
  // };
  // return <Select optionList={getSelectOptions()} {...props} />;
};
