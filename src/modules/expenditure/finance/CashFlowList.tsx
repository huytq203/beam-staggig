import { AppPagination } from '@components/shared';
import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { Button, Tag, Typography } from '@douyinfe/semi-ui';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import Table from 'rc-table';

const CashFlowList = (props: any) => {
  const { data, loading, onPaginate } = props;
  const { Text } = Typography;
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.RECONCILER,
    UserRole.ACCOUNTANT,
    UserRole.CONTROLLER,
  ]);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'right' as 'right',
      render: (value: any, record: any, index: any) => (
        <span>{StringHelper.indexTable(data?.number + 1, index)}</span>
      ),
      width: 150,
    },
    {
      title: 'Kỳ công',
      dataIndex: 'period',
      align: 'right' as 'right',
      width: 200,
      render: (e: any, record: any) => (
        <p>
          <span>
            {DateTimeHelper.convertTimeZone(e.startDate, COMMON_FORMAT.DATE)}
          </span>{' '}
          -{' '}
          <span>
            {DateTimeHelper.convertTimeZone(e.endDate, COMMON_FORMAT.DATE)}
          </span>
        </p>
      ),
    },
    {
      title: 'Doanh nghiệp',
      dataIndex: 'companyName',
      align: 'right' as 'right',
      width: 200,
      render: (name: any, record: any, a: any) => {
        return (
          <Text>
            <span className="beam-break-world">{name}</span>
          </Text>
        );
      },
    },
    {
      title: 'Hạn mức đầu kỳ',
      dataIndex: 'totalPayLimit',
      width: 200,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Hạn mức đã dùng trong kỳ',
      dataIndex: 'usedPayLimit',
      width: 200,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Hạn mức còn lại trong kỳ',
      dataIndex: 'remainPayLimit',
      width: 200,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Trạng thái kỳ lương',
      dataIndex: 'status',
      align: 'right' as 'right',
      width: 200,
      render: (e: any) => {
        let label = '';
        let colorText: any = '';
        let colorBg: any = '';
        switch (e) {
          case 0:
            label = 'Trong kỳ';
            colorText = '#1F5567';
            colorBg = '#E9f4f4';
            break;
          case 1:
            label = 'Kết thúc';
            colorText = '#BD0000';
            colorBg = '#F8E6E6';
            break;
        }
        return (
          <Button
            className={` border-r-0 rounded-none h-6 cursor-default`}
            style={{ color: `${colorText}`, backgroundColor: `${colorBg}` }}
          >
            {label}
          </Button>
        );
      },
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'payStatus',
      align: 'right' as 'right',
      width: 200,
      render: (e: any) => {
        let label = '';
        let colorText: any = '';
        let colorBg: any = '';
        switch (e) {
          case 0:
            label = 'Chậm thanh toán';
            colorText = '#BD9400';
            colorBg = '#F8F4E6';
            break;
          case 1:
            label = 'Trong kỳ lương';
            colorText = '#1F5567';
            colorBg = '#E9f4f4';

            break;
          case 2:
            label = 'Đã thanh toán';
            colorText = '#00BD5B';
            colorBg = '#E6F8EF';

            break;
          case 3:
            label = 'Nợ';
            colorText = '#BD0000';
            colorBg = '#F8E6E6';
            break;
          case 4:
            label = 'Chưa hạch toán';
            colorText = '#BD0000';
            colorBg = '#F8E6E6';
            break;
        }

        return (
          <Button
            className={` border-r-0 rounded-none h-6 cursor-default`}
            style={{ color: `${colorText}`, backgroundColor: `${colorBg}` }}
          >
            {label}
          </Button>
        );
      },
    },
    {
      title: 'Ngày cập nhật hệ thống',
      dataIndex: 'updatedAt',
      width: 200,
      align: 'right' as 'right',
      render: (e: any) => (
        <span>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</span>
      ),
    },
  ];
  const getTableData = () => {
    if (!data) return [];
    return data?.content;
  };

  if (loading) return <>...loading</>;

  return (
    <div className="flex flex-col gap-4">
      <Table
        data={getTableData()}
        columns={columns}
        scroll={{ x: 2000 }}
        emptyText={'Không có kết quả'}
        summary={(dataSummary: any) => {
          let total_PayLimit = 0;
          let totalUsedPayLimit = 0;
          let totalRemainPayLimit = 0;

          dataSummary.forEach(
            ({
              totalPayLimit,
              usedPayLimit,
              remainPayLimit,
            }: {
              totalPayLimit: any;
              usedPayLimit: any;
              remainPayLimit: any;
            }) => {
              total_PayLimit += totalPayLimit;
              totalUsedPayLimit += usedPayLimit;
              totalRemainPayLimit += remainPayLimit;
            }
          );
          return (
            <>
              {data?.content && (
                <>
                  <Table.Summary.Row className="total-page">
                    <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
                    <Table.Summary.Cell index={1} />
                    <Table.Summary.Cell index={2} />
                    <Table.Summary.Cell index={3}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(total_PayLimit)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalUsedPayLimit)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <div className="float-right">
                        <p>{StringHelper.formatVND(totalRemainPayLimit)}</p>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} />
                    <Table.Summary.Cell index={7} />
                    <Table.Summary.Cell index={8} />
                  </Table.Summary.Row>
                </>
              )}
            </>
          );
        }}
      />

      <div className="w-full flex justify-end">
        <AppPagination {...data} onChange={onPaginate} />
      </div>
    </div>
  );
};

export default CashFlowList;
