import { AppPagination } from '@components/shared';
import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { DebtService } from '@services/debt-cash';
import Table from 'rc-table';
import { useState } from 'react';
import { useQuery } from 'react-query';

export const CashflowOverview = () => {
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
  });
  const { data, isLoading, refetch } = useQuery(
    ['overview-list', filter],
    () => DebtService.getAllCashFlow(filter),
    {
      refetchOnWindowFocus: false,
    }
  );
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'right' as 'right',
      width: 100,
      render: (value: any, record: any, index: any) => (
        <span>{StringHelper.indexTable(filter.page, index)}</span>
      ),
    },
    {
      title: 'Doanh nghiệp',
      dataIndex: 'companyName',
      align: 'right' as 'right',
      width: 300,
    },
    {
      title: 'Hạn mức còn lại',
      dataIndex: 'remainPayLimit',
      align: 'right' as 'right',
      width: 200,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Chưa thanh toán',
      dataIndex: 'debit',
      align: 'right' as 'right',
      width: 200,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Ngày đến hạn thanh toán',
      dataIndex: 'expiredDate',
      align: 'right' as 'right',
      width: 200,
      render: (e: any) => (
        <p>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</p>
      ),
    },
    {
      title: 'Doanh nghiệp đã thanh toán',
      dataIndex: 'credit',
      align: 'right' as 'right',
      width: 200,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Doanh nghiệp còn phải thanh toán',
      dataIndex: 'remain',
      align: 'right' as 'right',
      width: 200,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'status',
      align: 'right' as 'right',
      width: 150,
      onCell: (record: any) => ({
        style: {
          color: record?.status == 4 ? 'red' : '',
          fontWeight: record?.status == 4 ? '900' : '',
        },
      }),
      render: (e: any) => {
        let label = '';
        switch (e) {
          case 0:
            label = 'Chậm thanh toán';
            break;
          case 1:
            label = 'Trong kỳ lương';
            break;
          case 2:
            label = 'Đã thanh toán';
            break;
          case 3:
            label = 'Nợ';
            break;
          case 4:
            label = 'Chưa hạch toán';
            break;
        }
        return <p>{label}</p>;
      },
    },
  ];
  const getTableData = () => {
    if (!data?.data?.content) return [];
    return data?.data?.content;
  };
  return (
    <div className="flex flex-col gap-4">
      <Table
        rowKey={(record: any, idx: any) =>
          record?.id ?? record?.companyId ?? `${record?.companyName}-${idx}`
        }
        data={getTableData()}
        columns={columns}
        scroll={{ x: 2000 }}
        emptyText={'Không có kết quả'}
        summary={(dataSummary: any) => {
          let totalRemainPayLimit = 0;
          let totalDebit = 0;
          let totalCredit = 0;
          let totalRemain = 0;

          dataSummary.forEach(
            ({
              remainPayLimit,
              debit,
              credit,
              remain,
            }: {
              remainPayLimit: any;
              debit: any;
              credit: any;
              remain: any;
            }) => {
              totalRemainPayLimit += remainPayLimit;
              totalDebit += debit;
              totalCredit += credit;
              totalRemain += remain;
            }
          );
          return (
            <>
              {data && (
                <>
                  <Table.Summary.Row className="total-page">
                    <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
                    <Table.Summary.Cell index={1} />
                    <Table.Summary.Cell index={2}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalRemainPayLimit)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalDebit)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} />

                    <Table.Summary.Cell index={5}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalCredit)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalRemain)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7} />
                  </Table.Summary.Row>
                </>
              )}
            </>
          );
        }}
      />
      <div className="w-full flex justify-end">
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
    </div>
  );
};
