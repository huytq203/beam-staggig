import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { IconEdit,IconLock } from '@douyinfe/semi-icons';
import { Tag, Typography } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { HRAdminFilter } from './HRAdminFilter';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
export const HRAdminList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const { profile } = useAuth();
  const [filter, setFilter] = useState({
    searchWord: '',
    page: 1,
    size: 10,
    companyIds: '',
    // enable: true,
  });
  const { data, isLoading, refetch } = useQuery(
    ['hr-list', filter],
    () => UserSevice.getAllHRAdmin(filter),
    {
      // enabled: !isLoading,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const { Text } = Typography;

  const router = useRouter();

  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 70,
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
                onClick={() => router.push(`${username}/edit-information-hr`)}
                link
              >
                <span className="beam-break-world">{username}</span>
              </Text>
            ) : (
              <Text>
                <span className="beam-break-world">{username}</span>
              </Text>
            )}
             {record.accountLocked ? (
              <Tag
                className="ml-2 align-middle"
                color="orange"
                prefixIcon={<IconLock size="small" />}
                size="small"
              >
                Đã khóa
              </Tag>
            ) : null}
          </>
        );
      },
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      width: 250,
      render: (name: any, record: any, a: any) => {
        return (
          <Text>
            <span className="beam-break-world">{name}</span>
          </Text>
        );
      },
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'code',
      width: 180,
    },
    {
      title: 'Công ty',
      dataIndex: 'companyNames',
      width: 350,
      render: (name: any, record: any, a: any) => {
        return (
          <Text>
            {name?.map((x: any, idx: any) => (
              <p key={`${x}-${idx}`} className="beam-break-world">
                -{x}
              </p>
            ))}
          </Text>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: 150,
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
      key: 'action',
      dataIndex: 'action',
      width: 140,
      render: (_: any, record: any) => {
        return (
          <ProtectedWrapper
            allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
          >
            <div className="flex gap-3 pl-3">
              <IconEdit
                onClick={() =>
                  router.push(`${record?.username}/edit-information-hr`)
                }
                className="cursor-pointer"
              />
            </div>
          </ProtectedWrapper>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <HRAdminFilter onFilter={setFilter} refetch={refetch} />
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
