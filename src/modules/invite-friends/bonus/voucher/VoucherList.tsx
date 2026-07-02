import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { Tag, Typography } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { VoucherFilter } from './VoucherFilter';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { useAuth } from '@contexts/authentication';
export const VoucherList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
    sort: ['createdAt,desc'],
  });

  //   const { data, isLoading, refetch } = useQuery(
  //     ['campaign-list', filter],
  //     () => CampaignService.getAll(filter),
  //     {
  //       refetchOnWindowFocus: false,
  //       refetchIntervalInBackground: true,
  //     }
  //   );
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
    // if (isLoading || !data?.content) return [];
    // return data?.content;
    return [];
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
      dataIndex: 'name',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Tên người giới thiệu',
      dataIndex: 'name',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Tên doanh nghiệp người giới thiệu',
      dataIndex: 'startTime',
      width: 180,
      render: (e: any) => <p className="beam-break-world">{e}</p>,
    },
    {
      title: 'Tổng tiền thưởng tích luỹ',
      dataIndex: 'endTime',
      width: 150,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Giá trị voucher đạt được',
      dataIndex: 'quantity',
      width: 150,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Ngày khởi tạo',
      dataIndex: 'used',
      width: 200,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'remain',
      width: 160,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Ngày chi thưởng',
      dataIndex: 'status',
      width: 200,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
  ];

  return (
    <ContentWrapper pageTitle="Quản lý chi thưởng voucher">
      <div className="flex flex-col gap-5">
        {showFilter && <VoucherFilter onFilter={setFilter} />}

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
