import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { BonusPresenteeFilter } from './BonusPresenteeFilter';
import { FriendInvatationService } from '@services/friend-invitation';
import { useAuth } from '@contexts/authentication';
export const BonusPresenteeList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
    // sort: ['createdAt,desc'],
  });

  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter],
    () => FriendInvatationService.getAllRewardPaymentInvitedReward(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
    UserRole.RECONCILER,
    UserRole.ACCOUNTANT,
  ]);
  const { Text } = Typography;

  const router = useRouter();

  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
    // return [];
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
      title: 'Người được giới thiệu',
      dataIndex: 'username',
      width: 180,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Số tiền thưởng',
      dataIndex: 'reward',
      width: 180,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 'EARNED':
            label = 'Đã chi thưởng';
            className = 'green';
            break;
          case 'PENDING':
            label = 'Chưa chi thưởng';
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
      title: 'Người cập nhật',
      dataIndex: 'updatedBy',
      width: 150,
      render: (e: any, record: any) =>
        e == 'SYSTEM' ? <p>Hệ thống</p> : <p>{e}</p>,
    },
    {
      title: 'Ngày khảo sát',
      dataIndex: 'createdAt',
      width: 200,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    // {
    //   title: 'Ngày chi thưởng',
    //   dataIndex: 'paymentDate',
    //   width: 200,
    //   render: (e: any) => (
    //     <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
    //   ),
    // },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 200,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
  ];

  return (
    <ContentWrapper pageTitle="Quản lý chi thưởng người được giới thiệu">
      <div className="flex flex-col gap-5">
        {showFilter && (
          <BonusPresenteeFilter onFilter={setFilter} refetch={refetch} />
        )}

        <AppTable
          size="small"
          // loading={isLoading}
          columns={columns}
          className="beam-break-world"
          dataSource={getTableData()}
          scroll={{ x: 'scroll' }}
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
    </ContentWrapper>
  );
};
