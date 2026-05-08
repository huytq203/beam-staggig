import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { BudgetFilter } from './BudgetFilter';
import { useAuth } from '@contexts/authentication';
import { FriendInvatationService } from '@services/friend-invitation';
import moment from 'moment';
export const BudgetList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    dateRanges: '',
  });

  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter],
    () => FriendInvatationService.getAllBudget(),
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
  const getTableData = () => {
    if (isLoading || !data) return [];
    let endMonth = data[0].updatedAt;
    for (let i = 0; i < data.length; i++) {
      if (moment(endMonth).diff(moment(data[i].updatedAt), 'months') == 0) {
        data[i].monthReward = 3000000;
      } else {
        data[i].monthReward = 6000000;
      }
    }
    return data.filter((x: any) => {
      return filter.dateRanges
        ? moment(filter.dateRanges).format('DD/MM/yyyy') ==
            moment(x.updatedAt).format('DD/MM/yyyy')
        : data;
    });
    // return [];
  };
  const columns = [
    // {
    //   title: 'STT',
    //   dataIndex: 'index',
    //   width: 100,
    //   render: (name: any, record: any, index: any) => {
    //     return (
    //       <Text>
    //         <span>{StringHelper.indexTable(filter.page, index)}</span>
    //       </Text>
    //     );
    //   },
    // },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 200,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Tổng tiền thưởng người được giới thiệu',
      dataIndex: 'totalRefereeReward',
      width: 250,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Tổng số người được giới thiệu được thưởng',
      dataIndex: 'totalRefree',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Tổng số người giới thiệu được thưởng',
      dataIndex: 'totalReferer',
      width: 180,
      render: (e: any) => <p className="beam-break-world">{e}</p>,
    },
    {
      title: 'Tổng số tiền thưởng theo chương trình cho người giới thiệu',
      dataIndex: 'totalRefererReward',
      width: 250,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Tổng số lượt thành công',
      dataIndex: 'totalReferSuccess',
      width: 150,
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Tổng số tiền thưởng voucher theo các mốc quan trọng',
      dataIndex: 'totalVoucherAmount',
      width: 160,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Tổng số tiền thưởng tháng',
      dataIndex: 'monthReward',
      width: 160,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Tổng hạn mức',
      dataIndex: 'totalPaylimit',
      width: 160,
      render: (e: any, record: any) => {
        let totalPaylimit =
          record.totalRefereeReward +
          record.totalRefererReward +
          record.totalVoucherAmount +
          record.monthReward;
        return <p>{StringHelper.formatVND(totalPaylimit)}</p>;
      },
    },
  ];

  return (
    <ContentWrapper pageTitle="Quản lý ngân sách">
      <div className="flex flex-col gap-5">
        {showFilter && <BudgetFilter onFilter={setFilter} refetch={refetch} />}

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
