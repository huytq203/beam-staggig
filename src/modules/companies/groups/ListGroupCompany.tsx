import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT, GeneralSubPath } from '@constants/index';
import { IconEdit, IconDelete } from '@douyinfe/semi-icons';
import {
  Divider,
  Notification,
  Pagination,
  Popconfirm,
  Table,
  Typography,
} from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { GroupsServices } from '@services/companies/groups/groups.service';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { FilterGroups } from './FilterGroups';
import { AppPagination } from '@components/shared';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { useAuth } from '@contexts/authentication';
const ListGroupsCompany = (props: any) => {
  const { onClickViewDetail, basePath } = props;
  const router = useRouter();
  const { companyId } = router.query;
  const { Text } = Typography;
  const { profile } = useAuth();
  const userRoles = profile?.roles;
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
    sort: ['createdAt,desc'],
  });
  const { data, isLoading, refetch } = useQuery(
    ['groups-company', filter],
    () => GroupsServices.getListGroupsInComany(filter, companyId),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const removeGroupCompany = (id: any) => {
    GroupsServices.removeGroupInCompany(id).then((x: any) => {
      if (x?.data?.code == 200 && x?.data?.message == 'OK') {
        Notification.success({
          content: 'Xóa thành công',
          duration: 2,
          theme: 'light',
        });
        refetch();
      }
    });
  };
  const columns = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      width: 150,
      align: 'right' as 'right',
      render: (name: any, record: any, a: any) => {
        return (
          <Text
            className="beam-break-world"
            onClick={() => onClickViewDetail(record)}
            link
          >
            {name}
          </Text>
        );
      },
    },
    {
      title: 'Mã nhóm',
      dataIndex: 'code',
      align: 'right' as 'right',
      width: 100,
    },
    {
      title: 'Hạn mức ứng',
      dataIndex: 'payLimitSalary',
      align: 'right' as 'right',
      render: (value: any, record: any, a: any) => {
        return (
          <>{StringHelper.formatValueByPayType(value, record.payLimitType)}</>
        );
      },
      width: 100,
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 180,
      align: 'right' as 'right',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'updatedBy',
      width: 180,
      align: 'right' as 'right',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Nội dung cập nhật',
      dataIndex: 'id',
      width: 180,
      align: 'right' as 'right',
      render: (userId: any, record: any) => {
        return (
          <Text
            onClick={() =>
              router.push(`/change-log/EmployeeGroup/${record.id}`)
            }
            link
            className="beam-break-world"
          >
            Xem lịch sử
          </Text>
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      width: 100,
      align: 'right' as 'right',
      render: (id: any, record: any) => {
        return (
          <>
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.HR_ADMIN,
                UserRole.CUSTOMER_SERVICE,
              ]}
            >
              <div className="flex gap-3 pl-3 justify-end">
                <IconEdit
                  onClick={() =>
                    router.push(`${basePath}/${id}/${GeneralSubPath.EDIT}`)
                  }
                  className="cursor-pointer"
                />
                {record.memberCount == null && userRoles[0] !== 'cs' && (
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa nhóm này không?"
                    // content="Bạn có chắc chắn muốn xóa chiến dịch này không?"
                    okText="Có"
                    cancelText="Không"
                    onConfirm={() => removeGroupCompany(id)}
                  >
                    <IconDelete
                      className="cursor-pointer"
                      style={{ color: 'var(--semi-color-danger)' }}
                    />
                  </Popconfirm>
                )}
              </div>
            </ProtectedWrapper>
          </>
        );
      },
    },
  ];
  const getColumn = () => {
    // if (userRoles[0] === 'reconciler') {
    //   return columns.filter((x: any) => x.title !== 'Nội dung cập nhật');
    // }
    return columns;
  };

  const [selectedTicketIds, setSelectedTicketId] = useState<String[]>([]);
  const rowSelection = {
    selectedTicketIds,
    getCheckboxProps: (record: any) => ({
      disabled: false,
      name: record.id,
    }),
    onSelect: (record: any, selected: any) => {
    },
    onSelectAll: (selected: any, selectedRows: any) => {
    },
    onChange: (selectedRowKeys: any, selectedRows: any) => {
    },
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
      {/* <div className="bg-white border-none rounded shadow-md overflow-auto p-0 mb-8"> */}
      {/* <CardActionTitle
                        title="Group List"
                        showDelete={false}
                        textAdd="Add new groups"
                        onAdd={() => router.push(`/companies/${companyId}/groups/create`)}
                    /> */}
      {/* <Divider dashed /> */}
      <FilterGroups onFilter={setFilter} refetch={refetch} />
      <Divider dashed />
      <AppTable
        size="small"
        loading={false}
        columns={getColumn()}
        dataSource={getTableData()}
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
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default ListGroupsCompany;
