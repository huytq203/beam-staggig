import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { Typography } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ContentWrapper } from '@components/widgets';
import { CustomerStatisticsFilter } from './CustomerStatisticFilter';
import { ReportService } from '@services/report';

export const CustomerStatisticsList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState('');

  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter],
    () => ReportService.getAllCustomerClassificationStatistics(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const { Text } = Typography;

  const router = useRouter();

  const getTableData = () => {
    if (isLoading || !data?.data) return [];
    return data?.data;
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
      title: 'Phân loại khách hàng',
      dataIndex: 'classificationCustomer',
      width: 250,
      render: (x: any) => {
        let label = '';

        switch (x) {
          case 'CUSTOMERS_HAVE_LARGE_SALARY_ADVANCE_LIMITS':
            label = 'Khách hàng có hạn mức lớn (Chưa đăng ký DVUL)';
            break;
          case 'CUSTOMERS_HAVE_LOW_SALARY_ADVANCE_LIMITS':
            label = 'Khách hàng có hạn mức thấp (Chưa đăng ký DVUL)';
            break;
          case 'LOYAL_CUSTOMERS':
            label = 'Khách hàng thân thiết';
            break;
          case 'POTENTIAL_CUSTOMERS':
            label = 'Khách hàng tiềm năng';
            break;
        }
        return <p className="beam-break-world">{label}</p>;
      },
    },
    {
      title: 'Số lượng khách hàng',
      dataIndex: 'numberOfCustomer',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Tỉ lệ',
      dataIndex: 'rate',
      width: 180,
      render: (e: any) => <p className="beam-break-world">{e}%</p>,
    },
  ];

  return (
    <ContentWrapper pageTitle="Thống kê phân loại">
      <div className="flex flex-col gap-5">
        {/* {showFilter && <CustomerStatisticsFilter onFilter={setFilter} />} */}

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
