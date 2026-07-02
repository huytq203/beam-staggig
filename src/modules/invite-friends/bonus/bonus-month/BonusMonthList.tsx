import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import {
  Modal,
  Notification,
  Popconfirm,
  Switch,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { BonusMonthFilter } from './BonusMonthFilter';
import { FriendInvatationService } from '@services/friend-invitation';
import { useAuth } from '@contexts/authentication';
import { COMMON_FORMAT } from '@constants/common-format';
export const BonusMonthList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    month: DateTimeHelper.getCurrentDate('fullDateObject', 2)?.month,
    year: DateTimeHelper.getCurrentDate('fullDateObject', 1)?.year,
    // sort: ['createdAt,desc'],
  });
  const { authCheckByRole, profile } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
    UserRole.RECONCILER,
    UserRole.ACCOUNTANT,
  ]);
  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter],
    () => FriendInvatationService.getAllRewardPaymentMonthReward(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const { Text } = Typography;

  const router = useRouter();

  const onClickAction = (record: any) => {
    const onRejectEarn = async (id: any) => {
      const data = await FriendInvatationService.rejectEarnReward(id);
      return data;
    };

    const onAcceptEarn = async (id: any) => {
      const data = await FriendInvatationService.acceptEarnReward(id);
      return data;
    };

    const onProcessStatus = (record: any) => {
      if (record.accepted === true) {
        return onRejectEarn(record.id);
      } else {
        return onAcceptEarn(record.id);
      }
    };
    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Quay lại',
      okText: 'Đồng ý',
      onOk: async () => {
        const data = await onProcessStatus(record);
        if (data) {
          Notification.success({
            content: `Thay đổi trạng thái thành công`,
            theme: 'light',
          });
          refetch();
        }
      },
      content:
        'Bạn hãy chắc chắn rằng những NLĐ này đủ điều kiện nhận thưởng. Thực hiện chi thưởng tháng ?',
    });
  };

  const getTableData = () => {
    if (isLoading || !data) return [];
    return data;
  };
  const checkDisableSwich = () => {
    return [
      UserRole.SALE,
      UserRole.CUSTOMER_SERVICE,
      UserRole.RECONCILER,
      UserRole.ACCOUNTANT,
    ].includes(profile?.roles[0]);
  };
  const columns = [
    {
      title: 'Người giới thiệu',
      dataIndex: 'username',
      width: 150,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Xếp hạng',
      dataIndex: 'rank',
      width: 150,
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Số lượng người được giới thiệu',
      dataIndex: 'invitedPeople',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Số lượng người được giới thiệu đủ tiêu chuẩn tính thưởng',
      dataIndex: 'acceptedPeople',
      width: 250,
      render: (e: any) => <p className="beam-break-world">{e}</p>,
    },
    {
      title: 'Số lượng lượt giới thiệu thành công',
      dataIndex: 'acceptedInvitation',
      width: 180,
      render: (e: any) => <p>{e}</p>,
    },

    {
      title: 'Số tiền thưởng đạt được',
      dataIndex: 'reward',
      width: 190,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Kỳ xét thưởng',
      dataIndex: 'period',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.MONTH_YEAR)}</>
      ),
    },
    {
      title: 'Xác nhận chi thưởng',
      dataIndex: 'accepted',
      width: 170,
      render: (e: any, record: any) => (
        <ProtectedWrapper
          allowedRoles={[
            UserRole.BEAM_ADMIN,
            UserRole.SUPER_ADMIN,
            UserRole.SALE,
            UserRole.CUSTOMER_SERVICE,
            UserRole.CONTROLLER,
            UserRole.RECONCILER,
            UserRole.ACCOUNTANT,
          ]}
        >
          <Switch
            checked={e}
            disabled={e || checkDisableSwich()}
            onChange={() => onClickAction(record)}
          />
        </ProtectedWrapper>
      ),
    },
    {
      title: 'Người xác nhận chi thưởng',
      dataIndex: 'acceptedBy',
      width: 210,
      render: (e: any) => <p className="beam-break-world">{e}</p>,
    },
    {
      title: 'Ngày xác nhận chi thưởng',
      dataIndex: 'acceptedTime',
      width: 200,
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
      title: 'Trạng thái chi thưởng',
      dataIndex: 'earnedRewardStatus',
      width: 180,
      render: (e: any) => {
        let label = '';
        let className: any = '';
        switch (e) {
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
  ];

  return (
    <ContentWrapper pageTitle="Quản lý chi thưởng tháng">
      <div className="flex flex-col gap-5">
        {showFilter && (
          <BonusMonthFilter onFilter={setFilter} refetch={refetch} />
        )}
        <AppTable
          size="small"
          // loading={isLoading}
          columns={columns}
          className="beam-break-world"
          dataSource={getTableData()}
          scroll={{ x: 'scroll' }}
          // renderPagination={(e: any) => {
          //   return (
          //     <div className="py-2 w-full flex justify-end">
          //       <AppPagination
          //         {...data}
          //         onChange={(e: any) => {
          //           setFilter({
          //             ...filter,
          //             page: e,
          //           });
          //         }}
          //       />
          //     </div>
          //   );
          // }}
        />
      </div>
    </ContentWrapper>
  );
};
