import { Select } from '@douyinfe/semi-ui';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { useMutation } from 'react-query';
import { forwardRef, useEffect, useState } from 'react';
import { EmployeesServices } from '@services/companies/accounts';
import useDebounce from '@hooks/useDebounce';

export const EmpolyeeFromCompanies = forwardRef<any, any>((props: any, ref: any) => {
  const [searchWord, setSearchWord] = useState('');
  const {
    onChange,
    value,
    multiple = false,
    companyIds,
    disabled = false,
    isAllCompany,
  } = props;
  const debouncedSearchWord = useDebounce(searchWord, 500);
  const mutation = useMutation(['employees-select'], (data: any) =>
    EmployeesServices.getListEmployeeFromMultipleCompany(data)
  );

  useEffect(() => {
    if (debouncedSearchWord) {
      mutation.mutate({
        companyIds: !isAllCompany ? companyIds : [],
        searchWord: debouncedSearchWord,
      });
    }
  }, [debouncedSearchWord]);
  const idsKey = companyIds?.join(',') ?? '';
  useEffect(() => {
    mutation.reset();
  }, [idsKey]);

  const getOptions = () => {
    if (!mutation.data || (!isAllCompany && companyIds.length < 1)) return [];
    return mutation.data.data?.employeeDTOS?.map((x: any, idx: any) => {
      return {
        label: `${x.name} - ${x.phoneNumber}`,
        value: x.phoneNumber,
      };
    });
  };

  return (
    <>
      <Select
        ref={ref}
        filter={FunctionBase.customSelectFilterOption}
        loading={mutation.isLoading}
        disabled={disabled}
        onSearch={(sugInput: string) => {
          setSearchWord(sugInput);
        }}
        optionList={getOptions()}
        value={value}
        placeholder="Họ tên/số điện thoại người lao động"
        onChange={(e: any) => onChange(e)}
        multiple={multiple}
        max={100}
        size="default"
      />
    </>
  );
});
EmpolyeeFromCompanies.displayName = 'EmpolyeeFromCompanies';
