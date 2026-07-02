import { Select } from '@douyinfe/semi-ui';
import { CompanyTypeService } from '@services/companies/companyTypes';
import { forwardRef, useState } from 'react';
import { useQuery } from 'react-query';

const SelectConfigPayFormProfile = forwardRef<any, any>((props, ref) => {
  const [filter, setFilter] = useState({
    name: 1,
    page: 1,
    size: 10,
    status: 0,
  });
  const { data, isLoading, refetch } = useQuery(
    ['pay-form-selection-list', filter],
    () => CompanyTypeService.getAll(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const payFormOptions = [
    {
      label: '01 ngày cố định trong tháng',
      value: 0,
    },
    {
      label: '02 ngày cố định trong tháng',
      value: 1,
    },
  ];
  const getSelectOptions = () => {
    if (isLoading || !data) return [];
    return payFormOptions.concat(
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
    <Select
      ref={ref}
      className="payForm"
      optionList={getSelectOptions()}
      {...props}
    />
  );
});

SelectConfigPayFormProfile.displayName = 'SelectConfigPayFormProfile';

export default SelectConfigPayFormProfile;
