import AppTable from '@components/shared/AppTable/AppTable';
import { AppPagination } from '@components/shared';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TermFormTypeService } from '@services/termform';
import { useRouter } from 'next/router';
import { CompanyService } from '@services/companies';
import { CompanyListFilter } from '../..';
import { Button } from '@douyinfe/semi-ui';
import { ApplyCompanyFilterTermForm } from './ApplyCompanytFilterTermFrom';

const ApplyCompanyTermForm = (props: any) => {
  const { setSelectedID, onSelectedRowKeysChange, companyId, isDefault } =
    props;

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['company-type-selection-list', filter],
    () => CompanyService.getAll(filter)
  );

  const {
    data: data1,
    isLoading: isLoading1,
    refetch: refetch1,
  } = useQuery(
    ['list-company-apply', companyId],
    () => TermFormTypeService.listApplyCompany(companyId),
    {
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (data1) {
      const arrRowKey = data1?.data?.map((idRowKey: any) => idRowKey.id);
      setSelectedRowKeys(arrRowKey);
    }
    return () => {
      setSelectedRowKeys([]);
    };
  }, [data1]);
  const router = useRouter();
  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };

  const defaultRowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      onSelectedRowKeysChange(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys,
  };

  const columns = [
    {
      title: 'Doanh Nghiệp',
      dataIndex: 'name',
      width: 400,
    },
  ];

  return (
    <div>
      <div>
        <ApplyCompanyFilterTermForm
          onFilter={setFilter}
          displayEmployeeKey={false}
        />
      </div>

      <div className="flex flex-col gap-4 mt-2.5">
        <AppTable
          size="small"
          scroll={{ y: 400 }}
          columns={columns}
          dataSource={getTableData()}
          rowSelection={isDefault ? false : defaultRowSelection}
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
        />
      </div>
    </div>
  );
};
export default ApplyCompanyTermForm;
