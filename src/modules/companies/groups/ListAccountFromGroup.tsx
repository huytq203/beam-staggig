import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { Divider, Table, Typography } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { EmployeesServices } from '@services/companies/accounts';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
export const ListAccountFromGroup = (props: any) => {
  const { groupId, basePath } = props;
  const router = useRouter();
  const { Text } = Typography;
  const [filter, setFilter] = useState({
    username: '',
    page: 1,
    size: 5,
  });

  const { data, isLoading, error } = useQuery(['users', filter], () =>
    EmployeesServices.getListEmployeesInGroup(filter, groupId)
  );

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      width: 250,
      align: 'right' as 'right',
      render: (name: any, record: any, a: any) => {
        return (
          <Text
            onClick={() => router.push(`${basePath}/${record.id}/edit`)}
            link
          >
            {name}
          </Text>
        );
      },
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'employeeCode',
      width: 250,
      align: 'right' as 'right',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
      align: 'right' as 'right',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      width: 250,
      align: 'right' as 'right',
    },
    // {
    //   title: 'Nhóm',
    //   dataIndex: 'groupName',
    //   width: 250,
    //   render: (x: any) => <>{x}</>,
    // },
    {
      title: 'Ngân hàng',
      dataIndex: 'bankName',
      width: 250,
      align: 'right' as 'right',
    },

    {
      title: 'Hạn mức tối đa',
      dataIndex: 'payLimitValue',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e, '-')}</p>,
    },
  ];

  const rowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Design docs',
      name: record.name,
    }),
    onSelect: (record: any, selected: any) => {},
    onSelectAll: (selected: any, selectedRows: any) => {},
    onChange: (selectedRowKeys: any, selectedRows: any) => {},
  };

  const getTableData = () => {
    if (!data) return [];

    return data?.content.map((x: any) => {
      return {
        ...x,
        key: x.id,
      };
    });
  };
  return (
    <div>
      <div className="bg-white border-none rounded shadow-md overflow-auto p-0">
        <>
          {/* <CardActionTitle
              title="User List"
              showDelete={false}
              textAdd="Add new user"
              onAdd={() => router.push(`/companies/${companyId}/accounts/create`)}
            />
            <Divider dashed /> */}
          <Divider dashed />
          <AppTable
            loading={isLoading}
            columns={columns}
            dataSource={getTableData()}
            pagination={false}
            rowSelection={rowSelection}
          />
          <div className="py-2 flex justify-end">
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
        </>
      </div>
    </div>
  );
};
