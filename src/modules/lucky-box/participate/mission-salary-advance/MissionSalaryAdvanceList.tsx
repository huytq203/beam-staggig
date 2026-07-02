import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { Typography } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { MissionSalaryAdvanceFilter } from './MissionSalaryAdvanceFilter';
import { LuckyBoxService } from '@services/lucky-box';
import { useRouter } from 'next/router';
export const MissionSalaryAdvanceList = (props: any) => {
  const { showFilter = true } = props;
  const { authCheckByRole } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
  });
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
    UserRole.ACCOUNTANT,
  ]);
  const { Text } = Typography;
  const { data, isLoading, refetch } = useQuery(
    ['user-transactions', filter],
    () => LuckyBoxService.getUserTransactions(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
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
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      width: 150,
      render: (e: any, record: any, a: any) => {
        return (
          <p>
            <Text
              link
              onClick={() => router.push(`/report/transaction?data=${e}`)}
            >
              {e}
            </Text>
          </p>
        );
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'employeeName',
      width: 280,
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Doanh nghiệp',
      dataIndex: 'companyName',
      width: 280,
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      width: 180,
      render: (e: any) => <>{e}</>,
    },
    {
      title: 'Số lần ứng lương',
      dataIndex: 'totalTransaction',
      width: 180,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalAmount',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p>{StringHelper.formatVND(e)}</p>;
      },
    },
  ];

  return (
    <ContentWrapper pageTitle="Danh sách tham gia">
      <div className="flex flex-col gap-5">
        {showFilter && (
          <MissionSalaryAdvanceFilter onFilter={setFilter} refetch={refetch} />
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
