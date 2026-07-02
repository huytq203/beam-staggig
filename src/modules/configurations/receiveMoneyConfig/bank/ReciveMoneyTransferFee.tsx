import { AppPagination } from '@components/shared';
import { COMMON_FORMAT } from '@constants/common-format';
import { Divider, Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { IconEdit } from '@douyinfe/semi-icons';
import { ConfigurationService } from '@services/configuration';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { BankFilter } from './BankFilter';
import { useRouter } from 'next/router';
import { StringHelper } from '@helpers/string.helper';
import AppTable from '@components/shared/AppTable/AppTable';
export const ReciveMoneyTransferFee = () => {
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
  });
  // const { authCheckByRole } = useAuth();
  // authCheckByRole([UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]);
  const { data, isLoading, refetch } = useQuery(
    ['transfer-fee-list', filter],
    () => ConfigurationService.getTransferFee(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const { Text } = Typography;
  const router = useRouter();
  const getTableData = () => {
    if (isLoading || !data?.data?.content) return [];
    return data?.data?.content;
  };

  const columns = [
    {
      title: 'Kênh chuyển tiền',
      dataIndex: 'channel',
      width: 250,
      render: (x: any, record: any) => {
        let label = '';

        switch (x) {
          case 0:
            label = 'Nội bộ';
            break;
          case 1:
            label = 'Napas';
            break;
          case 2:
            label = 'Citad';
            break;
        }
        return (
          <Text>
            {record.name}_{label}
          </Text>
        );
      },
    },
    {
      title: 'Phí chuyển tiền',
      dataIndex: 'fixedValue',
      width: 250,
      render: (e: any, record: any) => (
        <p>
          {record.feeType == 1 && record.channel == 2
            ? `----`
            : `${StringHelper.formatVND(e)}`}
        </p>
      ),
    },
    {
      title: 'User khởi tạo',
      dataIndex: 'createdBy',
      width: 250,
    },
    {
      title: 'User cập nhật',
      dataIndex: 'updatedBy',
      width: 250,
    },
    {
      title: 'Ngày khởi tạo',
      dataIndex: 'createdAt',
      width: 250,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 250,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 250,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 0:
            label = 'Hiệu lực';
            className = 'green';
            break;
          case 1:
            label = 'Hết hiệu lực';
            className = 'red';
            break;
          case 2:
            label = 'Chưa hiệu lực';
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
      title: 'Hành động',
      dataIndex: 'id',
      width: 150,
      render: (id: any, record: any) => {
        return (
          <div className="flex gap-3 pl-3">
            {record.status !== 1 && (
              <IconEdit
                onClick={() =>
                  router.push(
                    `/configurations/receive-money/transfer-fee/${record.id}/edit`
                  )
                }
                className="cursor-pointer"
              />
            )}
          </div>
        );
      },
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

export default ReciveMoneyTransferFee;
