import { AppPagination } from '@components/shared';
import { Typography } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { VoucherDiscountFilter } from './VoucherDiscountFilter';
import { LuckyBoxService } from '@services/lucky-box';
import { StringHelper } from '@helpers/string.helper';
import Table from 'rc-table';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';

export const VoucherDiscountList = (props: any) => {
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
    type: 'DISCOUNT_CARD',
    rewardStatus: '',
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['voucher-discount-reward', filter],
    () => LuckyBoxService.getAllReward(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const { data: totalData } = useQuery(
    ['overview-reward-total', filter],
    () =>
      LuckyBoxService.getTotalRewardDiscount({
        searchWord: filter.searchWord,
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
      title: 'Mã voucher',
      dataIndex: 'campaignCode',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Giá trị voucher',
      dataIndex: 'value',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'total',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Đã dùng',
      dataIndex: 'used',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
    {
      title: 'Còn lại',
      dataIndex: 'remain',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => <p>{e}</p>,
    },
  ];

  return (
    <ContentWrapper pageTitle="Danh sách chi thưởng">
      <div className="flex flex-col gap-5">
        {showFilter && (
          <VoucherDiscountFilter onFilter={setFilter} refetch={refetch} />
        )}

        <Table
          data={getTableData()}
          columns={columns}
          scroll={{ x: 2800, y: 400 }}
          emptyText={'Không có kết quả'}
          summary={(dataSummary: any) => {
            let totalQuantity = 0;
            let totalUsed = 0;
            let totalRemain = 0;
            let totalReward = 0;
            dataSummary.forEach(
              ({
                total,
                used,
                remain,
                value,
              }: {
                total: any;
                used: any;
                remain: any;
                value: any;
              }) => {
                totalQuantity += total;
                totalUsed += used;
                totalRemain += remain;
                totalReward +=
                  value !== null
                    ? (StringHelper.extractNumberfromStringVoucherDiscount(
                        value
                      ) as number) * total
                    : 0;
              }
            );

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
                      <Table.Summary.Cell index={4} />
                      <Table.Summary.Cell index={5} />
                      <Table.Summary.Cell index={6} />
                      <Table.Summary.Cell index={7} />
                      <Table.Summary.Cell index={8}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(totalReward)}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9}>
                        <div className="float-right">
                          <p>{totalQuantity}</p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={10}>
                        <div className="float-right">
                          <p>{totalUsed}</p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={11}>
                        <div className="float-right">
                          <p>{totalRemain}</p>
                        </div>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row className="total">
                      <Table.Summary.Cell index={0} colSpan={2}>
                        Tổng giao dịch
                      </Table.Summary.Cell>
                      {/* <Table.Summary.Cell index={1} /> */}
                      <Table.Summary.Cell index={2} />
                      <Table.Summary.Cell index={3} />
                      <Table.Summary.Cell index={4} />
                      <Table.Summary.Cell index={5} />
                      <Table.Summary.Cell index={6} />
                      <Table.Summary.Cell index={7} />
                      <Table.Summary.Cell index={8}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalData?.totalReward
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9}>
                        <div className="float-right">
                          <p>{totalData?.total}</p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={10}>
                        <div className="float-right">
                          <p>{totalData?.used}</p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={11}>
                        <div className="float-right">
                          <p>{totalData?.total - totalData?.used}</p>
                        </div>
                      </Table.Summary.Cell>
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
