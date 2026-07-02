import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { Table, Tag, Typography } from '@douyinfe/semi-ui';
import { TagColor } from '@douyinfe/semi-ui/lib/es/tag';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';

export interface TransactionTicketUpdateListProps {
  data: any;
  loading?: boolean;
  onClickUpdate?: any;
  setFilter: any;
  filterTicketTransaction: any;
}

const { Text } = Typography;

export const TransactionTicketUpdateList = (
  props: TransactionTicketUpdateListProps
) => {
  const { data, loading, onClickUpdate, setFilter, filterTicketTransaction } =
    props;

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      render: (text: any, record: any, index: any) => <p>{index + 1}</p>,
    },
    {
      title: 'Mã giao dịch(Beam)',
      dataIndex: 'refNum',
      width: 250,
      render: (name: any, record: any, a: any) => {
        return (
          <>
            {record?.status != 0 ? (
              <span className="beam-break-world">{name}</span>
            ) : (
              <Text link onClick={() => onClickUpdate(record)}>
                <span className="beam-break-world">{name}</span>
              </Text>
            )}
          </>
        );
      },
    },
    {
      title: 'Mã FT(Bank)',
      dataIndex: 'oldFTCode',
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
      dataIndex: 'benBankName',
      width: 250,
      render: (name: any) => <p className="beam-break-world">{name}</p>,
    },
    {
      title: 'Số tiền chuyển',
      dataIndex: 'oldAmount',
      width: 250,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Trạng thái giao dịch cũ',
      dataIndex: 'oldBeamStatus',
      width: 250,
      render: (e: any) => {
        let color: TagColor = 'grey';
        let label = '';

        switch (e) {
          case 1:
            color = 'green';
            label = 'Thành công';
            break;
          case 2:
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
      title: 'Trạng thái giao dịch mới',
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
      title: 'Số tiền cập nhật',
      dataIndex: 'amount',
      width: 250,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Mã FT cập nhật',
      dataIndex: 'ftCode',
      width: 250,
    },
    {
      title: 'User cập nhật',
      dataIndex: 'userUpdate',
      width: 250,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_by',
      width: 250,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Trạng thái duyệt',
      dataIndex: 'status',
      width: 250,
      render: (e: any) => {
        let color: TagColor = 'grey';
        let label = '';

        switch (e) {
          case 0:
            color = 'yellow';
            label = 'Chờ duyệt';
            break;
          case 1:
            color = 'green';
            label = 'Đã duyệt';
            break;
          case 2:
            color = 'red';
            label = 'Từ chối';
            break;
        }

        return (
          <Tag color={color} className="font-bold">
            {label}
          </Tag>
        );
      },
    },
  ];

  const getData = () => {
    if (!data) return [];
    // const result =
    //   filterTicketTransaction == 0
    //     ? data?.filter((e: any) => e.status === 0)
    //     : filterTicketTransaction == 1
    //     ? data?.filter((e: any) => e.status === 1)
    //     : data?.filter((e: any) => e.status === 2);
    // return result;
    return data;
  };

  return (
    <AppTable
      size="small"
      loading={loading}
      columns={columns}
      className="beam-break-world"
      dataSource={getData()}
    />
  );
};
