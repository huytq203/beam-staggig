import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { COMMON_FORMAT } from '@constants/common-format';
import {
  Divider,
  Modal,
  Notification,
  Switch,
  Table,
  Typography,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { EmployeesServices } from '@services/companies/accounts';
import { ConfigurationService } from '@services/configuration';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';

const ListAllEmpConfig = (props: any) => {
  const {
    basePath,
    companyId,
    onClickViewDetail,
    rowSelection,
    hiddenSelection,
    disabledAccountPicker,
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const router = useRouter();
  const { Text } = Typography;
  const [filter, setFilter] = useState({
    searchKey: '',
    asc: true,
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['emp_config', filter],
    () => ConfigurationService.getListAllEmpConfig(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      render: (name: any, record: any, index: any) => {
        return (
          <Text>
            <span>{StringHelper.indexTable(filter.page, index)}</span>
          </Text>
        );
      },
    },
    {
      title: 'Họ và tên',
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
      title: 'Email',
      dataIndex: 'email',
      width: 250,
      align: 'right' as 'right',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: 200,
      align: 'right' as 'right',
      render: (e: any) => StringHelper.convertPhoneNumber(e),
    },
    {
      title: 'Công ty',
      dataIndex: 'companyName',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => <>{e ? 'Đang làm việc' : 'Đã nghỉ việc'}</>,
    },
  ];

  const defaultRowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: disabledAccountPicker,
      name: record.name,
    }),
    onSelect: (record: any, selected: any) => {},
    onSelectAll: (selected: any, selectedRows: any) => {},
    // onChange: (selectedRowKeys: any, selectedRows: any) => {},
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    hidden: hiddenSelection,
  };

  const getTableData = () => {
    if (!data) return [];

    return data?.data?.content.map((x: any) => {
      return {
        ...x,
        key: x.id,
      };
    });
  };

  const getColumn = () => {
    return columns;
  };
  return (
    <div>
      <div className="flex flex-col gap-4">
        <AppTable
          size="small"
          loading={isLoading}
          columns={getColumn()}
          dataSource={getTableData()}
          pagination={false}
          scroll={{ x: 200 }}
          rowSelection={rowSelection ? rowSelection : defaultRowSelection}
        />
        <div className="py-2 flex justify-end">
          <AppPagination
            {...data?.data}
            onChange={(e: any) => {
              setFilter({
                ...filter,
                page: e,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ListAllEmpConfig;
