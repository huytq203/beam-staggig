import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import {
  Modal,
  Notification,
  Popconfirm,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { FilterHRList } from './FilterHRList';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import { ProtectedWrapper } from '@components/widgets/Auth';
export const ListHRCompany = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true, companyId } = props;
  const [filter, setFilter] = useState({
    searchWord: '',
    page: 1,
    size: 10,
    // enable: true,
  });
  const { data, isLoading, refetch } = useQuery(
    ['hr-list', filter, companyId],
    () => UserSevice.getAllHRAdminCompany(filter, companyId),
    {
      enabled: companyId !== null && companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const { profile } = useAuth();
  const { Text } = Typography;

  const router = useRouter();

  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };
  const onClickAction = (record: any, hasEligibleCompanies: any) => {
    const eligibleCompanies = record.eligibleCompanies;
    const onDisable = async () => {
      const eligibleCompaniesFilter = eligibleCompanies.filter(
        (x: any) => x !== companyId
      );
      const data = await UserSevice.updateHRAdmin({
        ...record,
        eligibleCompanies: eligibleCompaniesFilter,
      });
      return data;
    };

    const onEnable = async () => {
      const data = await UserSevice.updateHRAdmin({
        ...record,
        eligibleCompanies: [...eligibleCompanies, companyId],
      });
      return data;
    };
    const onProcessStatus = (record: any) => {
      if (hasEligibleCompanies) {
        return onDisable();
      } else {
        return onEnable();
      }
    };
    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Huỷ',
      okText: 'Thực hiện',
      onOk: async () => {
        const data = await onProcessStatus(record);
        if (data) {
          Notification.success({
            content: `Thay đổi quyền chốt báo cáo đối soát thành công`,
            theme: 'light',
          });
          refetch();
        }
      },
      content: `Bạn có chắc chắn muốn thay đổi quyền chốt báo cáo đối soát của tài khoản ${record?.username} không?`,
    });
  };

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
      title: 'Tài khoản',
      dataIndex: 'username',
      width: 200,
      render: (username: any, record: any, a: any) => {
        return (
          <>
            {profile?.roles[0] === UserRole.BEAM_ADMIN ||
            profile?.roles[0] === UserRole.SUPER_ADMIN ? (
              <Text
                onClick={() => router.push(`${basePath}/${username}/edit`)}
                link
              >
                <span className="beam-break-world">{username}</span>
              </Text>
            ) : (
              <Text>
                <span className="beam-break-world">{username}</span>
              </Text>
            )}
          </>
        );
      },
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      width: 250,
      render: (fullName: any, record: any, a: any) => {
        return (
          <Text>
            <span className="beam-break-world">{fullName}</span>
          </Text>
        );
      },
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'code',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: 180,
    },
    {
      title: 'Chốt báo cáo đối soát',
      dataIndex: 'eligibleCompanies',
      width: 120,
      render: (e: any, record: any) => {
        return (
          <ProtectedWrapper
            allowedRoles={[
              UserRole.BEAM_ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.CUSTOMER_SERVICE,
              UserRole.SALE,
            ]}
          >
            <Switch
              checked={e?.includes(companyId)}
              onChange={() => onClickAction(record, e?.includes(companyId))}
            />
          </ProtectedWrapper>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'enabled',
      width: 150,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case true:
            label = 'Hoạt động';
            className = 'green';
            break;
          case false:
            label = 'Không hoạt động';
            className = 'grey';
            break;
        }
        return (
          <Tag size="small" color={className}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Nội dung cập nhật',
      dataIndex: 'id',
      width: 180,
      render: (userId: any, record: any) => {
        return (
          <Text
            onClick={() => router.push(`/change-log/UserEntity/${record.id}`)}
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
      dataIndex: 'username',
      width: 150,
      render: (username: any, record: any) => {
        return (
          <div className="flex gap-3 pl-3">
            <ProtectedWrapper
              allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
            >
              <IconEdit
                onClick={() => router.push(`${basePath}/${username}/edit`)}
                className="cursor-pointer"
              />
            </ProtectedWrapper>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <FilterHRList
        onFilter={setFilter}
        companyId={companyId}
        refetch={refetch}
      />
      <AppTable
        size="small"
        loading={isLoading}
        columns={columns}
        className="beam-break-world"
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
      />
    </div>
  );
};
