import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { Button, Table, Tag, Typography } from '@douyinfe/semi-ui';
import { TagColor } from '@douyinfe/semi-ui/lib/es/tag';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
export interface ReconciliationBankTransactionListProps {
  loading?: boolean;
  data: any;
  onSaveRecordProperties?: any;
  setFilter: any;
  filter: any;
  bank: string;
}

export const ReconciliationBankTransactionList = (
  props: ReconciliationBankTransactionListProps
) => {
  const { data, loading, setFilter, filter, bank } = props;
  const router = useRouter();

  const checkStatusTransactionTicket = (record: any) => {
    if (record?.status === 0) {
      return true;
    } else if (record?.status === 1 && record?.newFTCode === null) {
      return true;
    }
  };

  const { Text } = Typography;

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      render: (text: any, record: any, index: any) => (
        <Text>
          <span>{StringHelper.indexTable(filter.page, index)}</span>
        </Text>
      ),
    },
    {
      title: 'Mã giao dịch(Beam)',
      dataIndex: 'id',
      width: 250,
    },
    {
      title: 'Mã FT(Bank)',
      dataIndex: 'ftCode',
      width: 250,
    },
    {
      title: 'Tên người thụ hưởng',
      dataIndex: 'benName',
      width: 250,
      // render: (name: any) => <p className='beam-break-world'>{name}</p>,
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'bankName',
      width: 250,
      render: (name: any) => <p className="beam-break-world">{name}</p>,
    },
    {
      title: 'Số tiền chuyển',
      dataIndex: 'amount',
      width: 250,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Trạng thái giao dịch (BEAM)',
      dataIndex: 'beamStatus',
      width: 250,
      render: (e: any) => {
        let color: TagColor = 'grey';
        let label = '';

        switch (e) {
          case 1:
            color = 'green';
            label = 'Thành công';
            break;
          case 0:
            color = 'red';
            label = 'Thất bại';
            break;
        }

        return (
          <Tag color={color} className="font-bold">
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái giao dịch (BANK)',
      dataIndex: 'bankStatus',
      width: 250,
      render: (e: any) => {
        let color: TagColor = 'grey';
        let label = '';

        switch (e) {
          case 1:
            color = 'green';
            label = 'Thành công';
            break;
          case 0:
            color = 'red';
            label = 'Thất bại';
            break;
        }

        return (
          <Tag color={color} className="font-bold">
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái đối soát',
      dataIndex: 'resultCollate',
      width: 250,
      render: (e: any) => {
        let color: TagColor = 'grey';
        let label = '';

        switch (e) {
          case 1:
            label = '01: Thành công ở BEAM, không có ở Bank';
            break;
          case 2:
            label = '02: Thành công ở Bank, không có ở BEAM';
            break;
          case 3:
            label = '03: Sai lệch dữ liệu';
            break;
        }

        return <p className="font-bold">{label}</p>;
      },
    },
    {
      title: 'Xử lý',
      dataIndex: 'action',
      width: 250,
      render: (e: any, record: any) => {
        return (
          <div>
            {checkStatusTransactionTicket(record) ? (
              <Button
                onClick={() => {
                  router.push({
                    pathname: `/reconciliation/${bank}/update-transition`,
                    query: { id: record?.id },
                  });
                }}
                theme="solid"
              >
                Cập nhật
              </Button>
            ) : // : record?.status === 2 &&
            //   record?.newFTCode === record?.ftCode &&
            //   record?.newBeamStatus === record?.beamStatus &&
            //   record?.newAmount === record?.amount ? (
            //   <p>Không có thay đổi</p>
            // ) : record?.status === 1 &&
            //   record?.newFTCode === record?.ftCode &&
            //   record?.newBeamStatus === record?.beamStatus &&
            //   record?.newAmount === record?.amount ? (
            //   <p>Không có thay đổi</p>
            // )
            record?.status === 2 ? (
              <p>Đang chờ duyệt</p>
            ) : record?.status === 1 ? (
              <>
                <p>
                  {record.newAmount !== record.amount && 'Cập nhật số tiền'}
                </p>
                <p>
                  {record.newBeamStatus !== record.beamStatus &&
                    'Cập nhật trạng thái'}
                </p>
                <p>{record.newFTCode !== record.ftCode && 'Cập nhật mã FT'}</p>
              </>
            ) : record?.status === 1 &&
              record?.newFTCode === record?.ftCode &&
              record?.newBeamStatus === record?.beamStatus &&
              record?.newAmount === record?.amount ? (
              <p>Không có thay đổi</p>
            ) : (
              ''
            )}
          </div>
        );
      },
    },
  ];

  const getData = () => {
    if (!data?.content) return [];
    return data?.content;
  };

  return (
    <>
      <AppTable
        loading={loading}
        columns={columns}
        size="small"
        dataSource={getData()}
        renderPagination={(e: any) => {
          return (
            <div className="py-2 w-full flex justify-end">
              <AppPagination
                {...data}
                onChange={(e: any) => {
                  setFilter({
                    page: e,
                  });
                }}
              />
            </div>
          );
        }}
      />
    </>
  );
};
