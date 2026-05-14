import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconAlignBottom } from '@douyinfe/semi-icons';
import { Table, Tag } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { ReconciliationService } from '@services/reconciliation';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ReconciliationBankFilter from './ReconciliationBankFilter';
import { AppPagination } from '@components/shared';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';

interface ReconciliationBankListProps {
  bank: string;
}

const ReconciliationBankList = (props: ReconciliationBankListProps) => {
  const { bank } = props;
  const [filter, setFilter] = useState({
    fileSource: bank.toUpperCase(),
    page: 1,
    size: 10,
  });
  const [filterBank, setFilterBank] = useState<any>(0);
  const { authCheckByRole } = useAuth();

  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CONTROLLER,
    UserRole.RECONCILER,
    UserRole.ACCOUNTANT,
  ]);
  const { data, isLoading, refetch } = useQuery(
    ['reconciliation-bank-list', filter],
    () => ReconciliationService.getAll(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const getTableData = () => {
    if (isLoading || !data?.data?.content) return [];

    return filterBank == 0
      ? data?.data?.content.filter(
          (e: any) => e.fileType !== 'BANK_MONTHLY_REPORT'
        )
      : data?.data?.content.filter(
          (e: any) => e.fileType === 'BANK_MONTHLY_REPORT'
        );
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      render: (text: any, record: any, index: any) => <p>{index + 1}</p>,
    },
    {
      title: 'File đối soát',
      dataIndex: 'filePath',
      width: 150,
      render: (e: any) => (
        <IconAlignBottom
          size="large"
          className="cursor-pointer text-blue-700"
          onClick={() => {
            const URL = `${e}`;
            if (typeof window !== 'undefined') {
              window.location.href = URL;
            }
          }}
        />
      ),
    },
    {
      title: 'Nguồn',
      dataIndex: 'fileType',
      width: 150,
      render: (e: any) => {
        if (e.includes('BEAM_BANK')) {
          return <p>BEAM</p>;
        } else {
          return <p>BANK</p>;
        }
      },
    },
    {
      title: 'Tên file đối soát',
      dataIndex: 'fileName',
      width: 260,
      // render: (name: any) => <p className='beam-break-world'>{name}</p>,
    },
    {
      title: 'Số lượng giao dịch',
      dataIndex: 'totalTransactions',
      width: 250,
    },
    {
      title: 'Giá trị giao dịch',
      dataIndex: 'totalAmount',
      width: 250,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Thời gian gửi file',
      dataIndex: 'createdTime',
      width: 250,
      render: (e: any) => (
        <p>
          {e === null
            ? ''
            : DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}
        </p>
      ),
    },
    {
      title: 'Thời gian nhận file',
      dataIndex: 'receiveTime',
      width: 250,
      render: (e: any) => (
        <p>
          {e === null
            ? ''
            : DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}
        </p>
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
            label = 'Đã gửi';
            className = 'green';
            break;
          case 1:
            label = 'Đã nhận';
            className = 'blue';
            break;
          case 2:
            label = 'Đã gửi thành công';
            className = 'light-green';
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
      title: 'Thao tác',
      dataIndex: 'action',
      width: 250,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <ReconciliationBankFilter
        title="Quản lý Đối soát"
        type={1}
        onFilterBank={setFilterBank}
      />
      <AppTable
        size="small"
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
  );
};

export default ReconciliationBankList;
