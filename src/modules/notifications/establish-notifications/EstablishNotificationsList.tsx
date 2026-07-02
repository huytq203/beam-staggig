import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconEdit } from '@douyinfe/semi-icons';
import { Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { NotificationManagementService } from '@services/notification-management';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { UserRole } from '@constants/auth.constants';
import { EstablishNotificationsListFilter } from './EstablishNotificationsListFilter';
export const EstablishNotificationsList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    // name: '',
    page: 1,
    size: 10,
    // type: 'TICKET',
    // subType: '',
    status: 3,
  });
  const { authCheckByRole, profile } = useAuth();
  authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN, UserRole.SALE]);
  const { data, isLoading, refetch } = useQuery(
    ['notification-schedule-list', filter],
    () => NotificationManagementService.getAllSchedule(filter),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const { Text } = Typography;

  const router = useRouter();
  const onClickHref = (slug: string) => {
    router.push(`/notifications/establish/${slug}/edit`);
  };
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
      title: 'Tiêu đề thông báo',
      dataIndex: 'title',
      width: 180,
      render: (name: any, record: any, index: any) => (
        // <Tooltip position="top" content={name}>
        <Text onClick={() => onClickHref(record.id)} link>
          <p className="beam-break-world">{name}</p>
        </Text>
        // </Tooltip>
      ),
    },
    {
      title: 'Loại thông báo',
      dataIndex: 'type',
      width: 250,
      render: (text: any, record: any) => {
        let label;
        switch (text) {
          case 'CUS_TICKET':
            label = 'Thông báo yêu cầu';
            break;
          case 'CUS_SYSTEM':
            label = 'Thông báo hệ thống';
            break;
          case 'CUS_CUSTOMER_CARE':
            label = 'Thông báo CSKH';
            break;
          case 'CUS_ALERT':
            label = 'Thông báo cảnh báo';
            break;
          case 'CUS_TRANSACTION':
            label = 'Thông báo giao dịch';
            break;
          case 'CUS_CONDITION':
            label = 'Thông báo điều kiện';
            break;
          case 'CUS_PROMOTION':
            label = 'Thông báo chiến dịch';
            break;
        }
        return <p className="beam-break-world">{label}</p>;
      },
    },
    {
      title: 'Thời gian gửi',
      dataIndex: 'sendTime',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Nội dung thông báo',
      dataIndex: 'content',
      width: 300,
      render: (e: any) => <TextOverflow children={e} />,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 150,
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
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
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

  return (
    <div>
      <ContentWrapper
        pageTitle="Quản lý thông báo"
        primaryButtonText="Thêm mới thông báo"
        onClickPrimaryButton={() =>
          router.push('/notifications/establish/create')
        }
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.SALE,
        ]}
      >
        <div className="px-6 pt-6">
          <EstablishNotificationsListFilter
            onFilter={setFilter}
            refetch={refetch}
          />
        </div>
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
      </ContentWrapper>
    </div>
  );
};
