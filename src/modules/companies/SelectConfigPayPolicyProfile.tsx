import { Select } from '@douyinfe/semi-ui';
import { CompanyTypeService } from '@services/companies/companyTypes';
import { useState } from 'react';
import { useQuery } from 'react-query';

const SelectConfigPayPolicyProfile = (props: any) => {
  const [filter, setFilter] = useState({
    name: 0,
    page: 1,
    size: 10,
    status: 0,
  });
  const { data, isLoading, refetch } = useQuery(
    ['pay-policy-selection-list', filter],
    () => CompanyTypeService.getAll(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const payPolicyOptions = [
    {
      value: 0,
      label: 'Kỳ lương tháng trước',
    },
    {
      value: 1,
      label: 'Kỳ lương tháng hiện tại',
    },
    {
      value: 2,
      label: 'Kỳ lương tháng sau',
    },
  ];
  const getSelectOptions = () => {
    if (isLoading || !data) return [];
    return payPolicyOptions.concat(
      data?.content
        .filter((x: any) => {
          if (x.status === 2) {
            return false;
          }
          return true;
        })
        .map((x: any) => {
          return {
            value: x.id,
            label: x.value,
          };
        })
    );
  };

  return (
    <Select className="payForm" optionList={getSelectOptions()} {...props} />
  );
};

export default SelectConfigPayPolicyProfile;
