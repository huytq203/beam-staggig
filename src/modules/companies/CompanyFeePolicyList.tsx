import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import { Table, Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { CompanyService } from '@services/companies';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';

export const detailProfileDataFields = [
  {
    dataField: 'creditLimit',
    label: 'Credit limit',
  },
  {
    dataField: 'payForm',
    label: 'Pay form',
  },
  {
    dataField: 'workday',
    label: 'Workday',
  },
  {
    dataField: 'payPolicy',
    label: 'Pay policy',
  },
  {
    dataField: 'lastWorkingDayOfPeriod',
    label: 'Last Working Day Of Period',
  },
];

export const CompanyFeePolicyList = (props: any) => {
  const { companyId, basePath } = props;
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
    // status: 0,
  });

  const router = useRouter();

  const { data, isLoading, refetch } = useQuery(
    ['company-fee', filter],
    () =>
      CompanyService.getCompanyFeePolicy({
        ...filter,
        companyId: companyId,
      }),
    {
      // enabled: !isLoading,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const { Text } = Typography;
  const onClickViewFeePolicyDetail = (rowData: any) => {
    // router.push(`/fee-policies/assign/${rowData.id}`);
    router.push({
      pathname: `/fee-policies/assign/${rowData.id}`,
      query: { companyId: companyId },
    });
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      // align: 'right' as 'right',
      render: (name: any, record: any, index: any) => {
        return (
          <Text>
            <span>{StringHelper.indexTable(filter.page, index)}</span>
          </Text>
        );
      },
    },
    {
      title: 'Chính sách phí',
      dataIndex: 'name',
      width: 420,
      // align: 'right' as 'right',
      render: (name: any, record: any, a: any) => {
        return (
          <Text onClick={() => onClickViewFeePolicyDetail(record)} link>
            <span className="beam-break-world">{name}</span>
          </Text>
        );
      },
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      width: 250,
      // align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      width: 250,
      // align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Doanh nghiệp chia sẻ phí',
      dataIndex: 'feeSharingValue',
      // align: 'right' as 'right',
      width: 250,
      render: (e: any, record: any) => (
        <p>
          {record.feeSharingType == 0
            ? `${StringHelper.formatVND(e)}`
            : `${e}%`}
        </p>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 280,
      // align: 'right' as 'right',
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
          case 3:
            label = 'Hết hạn';
            className = 'red';
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
  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };
  return (
    <div>
      <div>
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
      </div>
    </div>
  );
};
