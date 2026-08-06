import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { COMMON_FORMAT } from '@constants/common-format';
import { useAuth } from '@contexts/authentication';
import { IconEdit, IconLock } from '@douyinfe/semi-icons';
import { Button, Tag, Tooltip, Typography } from '@douyinfe/semi-ui';
import { ArrayHelper } from '@helpers/array.helper';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { UserSevice } from '@services/users';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserFilter } from './userFilter';

const EMPTY_VALUE = '—';

const formatDateTime = (value: any) =>
  value
    ? DateTimeHelper.convertTimeZone(value, COMMON_FORMAT.DATE_TIME)
    : EMPTY_VALUE;

const MetaRow = ({ label, children }: { label: string; children: any }) => (
  <div className="flex min-w-0 gap-2 text-sm">
    <span className="w-20 shrink-0 text-gray-500">{label}</span>
    <div className="min-w-0 flex-1 text-gray-900">{children}</div>
  </div>
);

export const UserList = (props: any) => {
  const { showFilter = true } = props;
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
  });
  const { data, isLoading, refetch } = useQuery(
    ['user-list', filter],
    () => UserSevice.getAllUser(filter),
    {
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
      width: 64,
      align: 'center' as const,
      render: (_: any, _record: any, index: number) => (
        <Text>{StringHelper.indexTable(filter.page, index)}</Text>
      ),
    },
    {
      title: 'Người dùng',
      dataIndex: 'username',
      width: 280,
      render: (username: any, record: any) => {
        const canEdit =
          profile?.roles[0] === UserRole.BEAM_ADMIN ||
          profile?.roles[0] === UserRole.SUPER_ADMIN;

        return (
          <div className="min-w-0 space-y-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="min-w-0 font-medium text-gray-900 beam-break-world">
                {record.fullName || username || EMPTY_VALUE}
              </span>
              {record.accountLocked ? (
                <Tooltip
                  content="Tài khoản đã bị tạm khóa do đăng nhập sai 5 lần."
                  position="top"
                >
                  <Tag
                    className="shrink-0"
                    color="orange"
                    prefixIcon={<IconLock size="small" />}
                    size="small"
                    tabIndex={0}
                  >
                    Đã khóa
                  </Tag>
                </Tooltip>
              ) : null}
            </div>

            {canEdit ? (
              <Text
                onClick={() => router.push(`${username}/edit-information-user`)}
                link
              >
                <span className="beam-break-world">{username}</span>
              </Text>
            ) : (
              <span className="text-sm text-gray-600 beam-break-world">
                {username || EMPTY_VALUE}
              </span>
            )}

            <TextOverflow
              className="text-sm text-gray-500"
              contentText={record.email || EMPTY_VALUE}
            >
              {record.email || EMPTY_VALUE}
            </TextOverflow>
          </div>
        );
      },
    },
    {
      title: 'Thông tin công việc',
      dataIndex: 'companyName',
      width: 300,
      render: (_: any, record: any) => {
        const employeeCodes = ArrayHelper.removeEmlementNullOrUndefine(
          record.code
        ).join(', ');
        const companyNames = ArrayHelper.removeEmlementNullOrUndefine(
          record.companyName
        ).join(', ');

        return (
          <div className="space-y-2">
            <MetaRow label="Mã NV">
              <TextOverflow contentText={employeeCodes || EMPTY_VALUE}>
                {employeeCodes || EMPTY_VALUE}
              </TextOverflow>
            </MetaRow>
            <MetaRow label="Doanh nghiệp">
              <TextOverflow
                line={2}
                contentText={companyNames || EMPTY_VALUE}
              >
                {companyNames || EMPTY_VALUE}
              </TextOverflow>
            </MetaRow>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'enabled',
      width: 130,
      render: (enabled: any) =>
        enabled === null || enabled === undefined ? (
          <span className="text-gray-500">{EMPTY_VALUE}</span>
        ) : (
          <Tag size="small" color={enabled ? 'green' : 'grey'}>
            {enabled ? 'Hoạt động' : 'Không hoạt động'}
          </Tag>
        ),
    },
    {
      title: 'Thông tin ứng lương',
      dataIndex: 'registerSalaryAdvanceDate',
      width: 230,
      render: (_: any, record: any) => (
        <div className="space-y-2">
          <MetaRow label="Đăng ký">
            {formatDateTime(record.registerSalaryAdvanceDate)}
          </MetaRow>
          <MetaRow label="Xác nhận">
            {formatDateTime(record.verifiedInformationDate)}
          </MetaRow>
        </div>
      ),
    },
    {
      title: 'Khởi tạo & cập nhật',
      dataIndex: 'updatedAt',
      width: 260,
      render: (_: any, record: any) => (
        <div className="space-y-2">
          <MetaRow label="Ngày tạo">
            {formatDateTime(record.createdDate)}
          </MetaRow>
          <MetaRow label="Cập nhật">
            {formatDateTime(record.updatedAt)}
          </MetaRow>
          <MetaRow label="Bởi">
            <TextOverflow contentText={record.updatedBy || EMPTY_VALUE}>
              {record.updatedBy || EMPTY_VALUE}
            </TextOverflow>
          </MetaRow>
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      dataIndex: 'action',
      width: 88,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: any) => {
        return (
          <ProtectedWrapper
            allowedRoles={[
              UserRole.BEAM_ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.CUSTOMER_SERVICE,
            ]}
          >
            <Tooltip content="Chỉnh sửa tài khoản" position="top">
              <Button
                aria-label={`Chỉnh sửa tài khoản ${record?.username || ''}`}
                icon={<IconEdit />}
                theme="borderless"
                type="tertiary"
                onClick={() =>
                  router.push(`${record?.username}/edit-information-user`)
                }
              />
            </Tooltip>
          </ProtectedWrapper>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {showFilter && <UserFilter onFilter={setFilter} refetch={refetch} />}
      <AppTable
        rowKey="id"
        size="small"
        loading={isLoading}
        columns={columns}
        className="beam-break-world"
        dataSource={getTableData()}
        scroll={{ x: 1300 }}
        renderPagination={() => {
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
