import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { RankFilter } from './RankFilter';
import { FriendInvatationService } from '@services/friend-invitation';
import { useAuth } from '@contexts/authentication';
export const RankList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    searchWord: '',
    monthValue: DateTimeHelper.getCurrentDate('fullDateObject', 2)?.month,
    yearValue: DateTimeHelper.getCurrentDate('fullDateObject', 1)?.year,
    page: 1,
    size: 10,
  });
  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter],
    () => FriendInvatationService.getAllMonthRanking(filter),
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
      width: 180,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Xếp hạng',
      dataIndex: 'rank',
      width: 120,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
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
      title: 'Số lượng người được giới thiệu đủ tiêu chuẩn nhận thưởng',
      dataIndex: 'acceptedPeople',
      width: 280,
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Số lượt giới thiệu thành công',
      dataIndex: 'acceptedInvitation',
      width: 180,
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Số tiền thưởng dự kiến theo chương trình',
      dataIndex: 'reward',
      width: 280,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Ngày cập nhật tiền thưởng dự kiến',
      dataIndex: 'expectedRewardConsiderationDate',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedDate',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Kỳ xét thưởng',
      dataIndex: 'rewardPeriod',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.MONTH_YEAR)}</>
      ),
    },
  ];

  return (
    <ContentWrapper pageTitle="Theo dõi xếp hạng">
      <div className="flex flex-col gap-5">
        {showFilter && <RankFilter onFilter={setFilter} />}

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
