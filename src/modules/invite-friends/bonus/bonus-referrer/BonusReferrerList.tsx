import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
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
import { BonusReferrerFilter } from './BonusReferrerFilter';
import { FriendInvatationService } from '@services/friend-invitation';
import { useAuth } from '@contexts/authentication';
export const BonusReferrerList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter],
    () => FriendInvatationService.getAllRewardPaymentInviterReward(filter),
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
      title: 'Người giới thiệu',
      dataIndex: 'phoneNumber',
      width: 150,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Tên doanh nghiệp',
      dataIndex: 'companyName',
      width: 280,
      render: (e: any) => (
        <TextOverflow line={1}>
          <p className="beam-break-world">{e}</p>
        </TextOverflow>
      ),
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'bankAccountNumber',
      width: 150,
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'bankHolderName',
      width: 180,
      render: (e: any) => <p className="beam-break-world">{e}</p>,
    },
    {
      title: 'Ngân hàng thụ hưởng',
      dataIndex: 'bankName',
      width: 180,
      render: (e: any) => <p className="beam-break-world">{e}</p>,
    },
    {
      title: 'Tổng số tiền thưởng tích lũy',
      dataIndex: 'totalReward',
      width: 160,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Số tiền thưởng khả dụng',
      dataIndex: 'currentRemainReward',
      width: 180,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Số tiền chi thưởng',
      dataIndex: 'amount',
      width: 180,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Số tiền thưởng chưa chi',
      dataIndex: 'remainReward',
      width: 200,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Nội dung',
      dataIndex: 'remark',
      width: 250,
      render: (e: any) => (
        <TextOverflow line={1}>
          <p className="beam-break-world">{e}</p>
        </TextOverflow>
      ),
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'refNum',
      width: 200,
    },
    {
      title: 'Mã FT',
      dataIndex: 'bankId',
      width: 160,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 'PENDING':
            label = 'Chờ trả thưởng';
            className = 'yellow';
            break;
          case 'PROCESSING':
            label = 'Đang trả thưởng';
            className = 'cyan';
            break;
          case 'REJECTED':
            label = 'Từ chối trả thưởng';
            className = 'red';
            break;
          case 'SUCCESS':
            label = 'Đã trả thưởng';
            className = 'green';
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
      title: 'Ngày chi thưởng',
      dataIndex: 'createdAt',
      width: 150,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 150,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
  ];

  return (
    <ContentWrapper pageTitle="Quản lý chi thưởng người giới thiệu">
      <div className="flex flex-col gap-5">
        {showFilter && (
          <BonusReferrerFilter onFilter={setFilter} refetch={refetch} />
        )}

        <AppTable
          size="small"
          loading={isLoading}
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
