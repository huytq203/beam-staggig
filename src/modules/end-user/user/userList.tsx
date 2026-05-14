import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { IconEdit } from '@douyinfe/semi-icons';
import { Tag, Typography } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { ArrayHelper } from '@helpers/array.helper';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import { UserFilter } from './userFilter';
import { ProtectedWrapper } from '@components/widgets/Auth';
export const UserList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const { authCheckByRole, profile } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const [filter, setFilter] = useState({
    searchWord: '',
    page: 1,
    size: 10,
    // enable: true,
  });
  const { data, isLoading, refetch } = useQuery(
    ['user-list', filter],
    () => UserSevice.getAllUser(filter),
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
      width: 150,
      render: (username: any, record: any, a: any) => {
        return (
          <>
            {profile?.roles[0] === UserRole.BEAM_ADMIN ||
            profile?.roles[0] === UserRole.SUPER_ADMIN ? (
              <Text
                onClick={() => router.push(`${username}/edit-information-user`)}
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
      title: 'Họ tên',
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
      width: 200,
      render: (x: any, record: any) => {
        return (
          <TextOverflow>
            {ArrayHelper.removeEmlementNullOrUndefine(record.code)
              .map((code: any) => code)
              .join(', ')}
          </TextOverflow>
        );
      },
    },
    // {
    //   title: 'Công ty',
    //   dataIndex: 'company',
    //   width: 200,
    // },
    {
      title: 'Công ty',
      dataIndex: 'companyName',
      width: 350,
      render: (x: any, record: any) => {
        return (
          <TextOverflow>
            {ArrayHelper.removeEmlementNullOrUndefine(record.companyName)
              .map((companyName: any) => companyName)
              .join(', ')}
          </TextOverflow>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
    },
    // {
    //   title: 'Số điện thoại',
    //   dataIndex: 'phone',
    //   width: 150,
    // },
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
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Ngày đăng ký ứng lương',
      dataIndex: 'registerSalaryAdvanceDate',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Ngày xác nhận thông tin',
      dataIndex: 'verifiedInformationDate',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },

    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'updatedBy',
      width: 150,
    },
    {
      title: 'Hành động',
      dataIndex: 'username',
      width: 150,
      render: (username: any, record: any) => {
        return (
          <div className="flex gap-3 pl-3">
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.CUSTOMER_SERVICE,
              ]}
            >
              <IconEdit
                onClick={() => router.push(`${username}/edit-information-user`)}
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
      <UserFilter onFilter={setFilter} refetch={refetch} />
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
