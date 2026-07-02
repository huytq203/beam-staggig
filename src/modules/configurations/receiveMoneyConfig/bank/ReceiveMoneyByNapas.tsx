import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { Divider, Tag } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { ConfigurationService } from '@services/configuration';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { BankFilter } from './BankFilter';

const ReceiveMoneyByNapas = () => {
  const [filter, setFilter] = useState({
    searchKey: '',
    napas: true,
    napasAccount: true,
    napasCard: true,
    status: 0,
    page: 1,
    size: 10,
  });
  const { data, isLoading, refetch } = useQuery(
    ['transfer-type-list', filter],
    () => ConfigurationService.getTransferType(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  // const router = useRouter();
  const getTableData = () => {
    if (isLoading || !data?.data?.content) return [];
    return data?.data?.content;
  };

  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 250,
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
    {
      title: 'Mã ID',
      dataIndex: 'id',
      width: 250,
    },
    {
      title: 'Tên ngân hàng',
      dataIndex: 'bankName',
      width: 250,
      render: (name: any) => <p className="beam-break-world">{name}</p>,
    },
    {
      title: 'Tên viết tắt',
      dataIndex: 'shortName',
      width: 250,
    },
    {
      title: 'BIN_Napas',
      dataIndex: 'bin',
      width: 250,
    },
    {
      title: 'Account Napas',
      dataIndex: 'napasAccount',
      width: 250,
      render: (x: any) => {
        let label = '';

        switch (x) {
          case true:
            label = 'Y';
            break;
          case false:
            label = 'N';
            break;
        }
        return <p>{label}</p>;
      },
    },
    {
      title: 'Card Napas',
      dataIndex: 'napasCard',
      width: 250,
      render: (x: any) => {
        let label = '';

        switch (x) {
          case true:
            label = 'Y';
            break;
          case false:
            label = 'N';
            break;
        }
        return <p>{label}</p>;
      },
    },
    {
      title: 'Kênh chuyển tiền',
      dataIndex: 'channel',
      width: 250,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedTime',
      width: 250,
      render: (e: any) => (
        <>{DateTimeHelper.formatDateTime(e, COMMON_FORMAT.DATE)}</>
      ),
    },
  ];

  return (
    <div className="px-4">
      <BankFilter refetch={refetch} />
      <Divider dashed />
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
                {...data?.data}
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
  );
};

export default ReceiveMoneyByNapas;
