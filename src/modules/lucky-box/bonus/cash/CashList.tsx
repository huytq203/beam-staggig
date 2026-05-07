import { AppPagination } from '@components/shared';
import { COMMON_FORMAT } from '@constants/common-format';
import { Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { CashFilter } from './CashFilter';
import { LuckyBoxService } from '@services/lucky-box';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import Table from 'rc-table';

export const CashList = (props: any) => {
  const { showFilter = true } = props;
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
    UserRole.ACCOUNTANT,
  ]);
  const { Text } = Typography;
  const [filter, setFilter] = useState({
    searchWord: '',
    type: 'CASH',
    rewardStatus: '',
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['voucher-shopping-reward', filter],
    () => LuckyBoxService.getAllReward(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const { data: totalData } = useQuery(
    ['overview-reward-total', filter],
    () =>
      LuckyBoxService.getTotalReward({
        searchWord: filter.searchWord,
        type: 'CASH',
      }),
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
      align: 'right' as 'right',
      render: (name: any, record: any, index: any) => {
        return (
          <Text>
            <span>{StringHelper.indexTable(filter.page, index)}</span>
          </Text>
        );
      },
    },
    {
      title: 'Mã chi thưởng',
      dataIndex: 'rewardCode',
      width: 180,
      align: 'right' as 'right',
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p className="beam-break-world">{e}</p>,
    },
    {
      title: 'Doanh nghiệp',
      dataIndex: 'company',
      width: 280,
      align: 'right' as 'right',
      render: (e: any) => <p className="beam-break-world">{e}</p>,
    },
    {
      title: 'Nhiệm vụ',
      dataIndex: 'mission',
      width: 280,
      align: 'right' as 'right',
      render: (e: any, record: any, a: any) => {
        return (
          <p className="beam-break-world">{`${e} - Nhiệm vụ ${
            record.level + 1
          }`}</p>
        );
      },
    },
    {
      title: 'Hành động nhận quà',
      dataIndex: 'action',
      width: 280,
      align: 'right' as 'right',
      render: (e: any, record: any, a: any) => {
        let label = '';
        switch (e) {
          case 'DRAW_LUCKY':
            label = 'Mở hộp quà';
            break;
          case 'CLAIM_PRIZE':
            label = 'Hoàn thành nhiệm vụ';
            break;
        }
        return <p className="beam-break-world">{label}</p>;
      },
    },
    {
      title: 'Ngày nhận quà',
      dataIndex: 'receivedAt',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'bankAccountNumber',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'bankHolderName',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Ngân hàng thụ hưởng',
      dataIndex: 'bankName',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Số tiền thưởng',
      dataIndex: 'amount',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Nội dung',
      dataIndex: 'description',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <TextOverflow line={2}>{e}</TextOverflow>,
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'transactionCode',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Mã FT',
      dataIndex: 'ftCode',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 250,
      align: 'right' as 'right',
      render: (e: any, record: any, a: any) => {
        let color: any = '';
        let label = '';
        switch (e) {
          case 'PAID':
            color = 'green';
            label = 'Đã chi thưởng';
            break;
          case 'NOT_PAID':
            color = 'yellow';
            label = 'Chưa chi thưởng';
            break;
          case 'CANCELED_REWARD':
            color = 'red';
            label = 'Huỷ chi thưởng';
            break;
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Ngày chi thưởng',
      dataIndex: 'rewardAt',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },

    {
      title: 'Người tải lên',
      dataIndex: 'rewardBy',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updateAt',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
  ];

  return (
    <ContentWrapper pageTitle="Danh sách chi thưởng">
      <div className="flex flex-col gap-5">
        {showFilter && <CashFilter refetch={refetch} onFilter={setFilter} />}

        <Table
          data={getTableData()}
          columns={columns}
          scroll={{ x: 2800, y: 400 }}
          emptyText={'Không có kết quả'}
          summary={(dataSummary: any) => {
            let totalAmount = 0;
            dataSummary.forEach(({ amount }: { amount: any }) => {
              totalAmount += amount;
            });
            return (
              <Table.Summary fixed={true}>
                {data && (
                  <>
                    <Table.Summary.Row className="total-page">
                      <Table.Summary.Cell index={0} colSpan={2}>
                        Tổng giao dịch trang
                      </Table.Summary.Cell>
                      {/* <Table.Summary.Cell index={1} /> */}
                      <Table.Summary.Cell index={2} />
                      <Table.Summary.Cell index={3} />
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}></Table.Summary.Cell>
                      <Table.Summary.Cell index={6}></Table.Summary.Cell>
                      <Table.Summary.Cell index={7}></Table.Summary.Cell>
                      <Table.Summary.Cell index={8}></Table.Summary.Cell>
                      <Table.Summary.Cell index={9}></Table.Summary.Cell>
                      <Table.Summary.Cell index={10} />
                      <Table.Summary.Cell index={11}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(totalAmount)}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={12} />
                      <Table.Summary.Cell index={13} />
                      <Table.Summary.Cell index={14} />
                      <Table.Summary.Cell index={15} />
                      <Table.Summary.Cell index={16} />
                      <Table.Summary.Cell index={17} />
                      <Table.Summary.Cell index={18} />
                    </Table.Summary.Row>
                    <Table.Summary.Row className="total">
                      <Table.Summary.Cell index={0} colSpan={2}>
                        Tổng giao dịch
                      </Table.Summary.Cell>
                      {/* <Table.Summary.Cell index={1} /> */}
                      <Table.Summary.Cell index={2} />
                      <Table.Summary.Cell index={3} />
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}></Table.Summary.Cell>
                      <Table.Summary.Cell index={6}></Table.Summary.Cell>
                      <Table.Summary.Cell index={7}></Table.Summary.Cell>
                      <Table.Summary.Cell index={8}></Table.Summary.Cell>
                      <Table.Summary.Cell index={9}></Table.Summary.Cell>
                      <Table.Summary.Cell index={10} />
                      <Table.Summary.Cell index={11}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalData?.totalCash
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={12} />
                      <Table.Summary.Cell index={13} />
                      <Table.Summary.Cell index={14} />
                      <Table.Summary.Cell index={15} />
                      <Table.Summary.Cell index={16} />
                      <Table.Summary.Cell index={17} />
                      <Table.Summary.Cell index={18} />
                    </Table.Summary.Row>
                  </>
                )}
              </Table.Summary>
            );
          }}
        />
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
      </div>
    </ContentWrapper>
  );
};
