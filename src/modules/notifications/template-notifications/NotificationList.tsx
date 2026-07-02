import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconEdit } from '@douyinfe/semi-icons';
import { Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ContentWrapper } from '@components/widgets';
import { NotificationManagementService } from '@services/notification-management';
import { NotificationListFilter } from './NotificationListFilter';
import {
  notificationSubType,
  notificationType,
} from '@constants/notification.constants';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';

export const NotificationList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const { authCheckByRole, profile } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CONTROLLER,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
    type: 'TICKET',
    subType: '',
    status: 0,
  });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, refetch } = useQuery(
    ['notification-list', filter],
    () => NotificationManagementService.getAll(filter),
    {
      enabled: true,
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
      width: 80,
      render: (name: any, record: any, index: any) => {
        return (
          <Text>
            <span>{StringHelper.indexTable(filter.page, index)}</span>
          </Text>
        );
      },
    },
    {
      title: 'Nhóm thông báo',
      dataIndex: 'type',
      width: 200,
      render: (text: any, record: any) => {
        const type = notificationType.find((x: any) => x.value == text);
        if (!type) return '';
        return <p className="beam-break-world">{type.label}</p>;
      },
    },
    {
      title: 'Loại thông báo',
      dataIndex: 'subType',
      width: 250,
      render: (text: any, record: any) => {
        const subType = notificationSubType.find((x: any) => x.value == text);
        if (!subType) return '';
        return <p className="beam-break-world">{subType.label}</p>;
      },
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
      dataIndex: 'updateBy',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 0:
            label = 'Hoạt động';
            className = 'green';
            break;
          case 1:
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
      title: 'Hành động',
      dataIndex: 'id',
      width: 100,
      render: (id: any, record: any) => {
        return (
          <div className="flex gap-3 pl-3 justify-end">
            <IconEdit
              onClick={() => router.push(`${basePath}/${id}/edit`)}
              className="cursor-pointer"
            />
            {/* {record.memberCount == null && (
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa loại thông báo này không?"
                okText="Có"
                cancelText="Không"
              >
                <IconDelete
                  className="cursor-pointer"
                  style={{ color: 'var(--semi-color-danger)' }}
                />
              </Popconfirm>
            )} */}
          </div>
        );
      },
    },
  ];

  const getColums = () => {
    if (
      [UserRole.CONTROLLER, UserRole.CUSTOMER_SERVICE].includes(
        profile?.roles[0]
      )
    ) {
      return columns.filter((x: any) => x.title !== 'Hành động');
    }
    return columns;
  };

  return (
    <div>
      <ContentWrapper
        pageTitle="Quản lý thông báo"
        primaryButtonText="Thêm mới thông báo"
        onClickPrimaryButton={() =>
          router.push('/notifications/templates/create')
        }
      >
        <div className="px-6 pt-6">
          <div className="flex flex-col gap-5 mb-5">
            <NotificationListFilter onFilter={setFilter} refetch={refetch} />
          </div>
        </div>
        {mounted && (
          <AppTable
            size="small"
            loading={isLoading}
            columns={getColums()}
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
        )}
      </ContentWrapper>
    </div>
  );
};
