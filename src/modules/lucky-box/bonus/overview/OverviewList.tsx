import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import Table from 'rc-table';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { OverviewFilter } from './OverviewFilter';
import { LuckyBoxService } from '@services/lucky-box';
export const OverviewList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
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
    type: 'ALL',
    rewardStatus: '',
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['overview-reward', filter],
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
        type: 'ALL',
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

      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 250,
      align: 'right' as 'right',

      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Doanh nghiệp',
      dataIndex: 'company',
      width: 250,
      align: 'right' as 'right',

      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Thẻ điện thoại',
      dataIndex: 'phoneCard',
      width: 150,
      align: 'right' as 'right',

      render: (e: any, record: any, a: any) => {
        return <p>{StringHelper.formatVNDWithZeroNumber(e)}</p>;
      },
    },
    {
      title: 'Voucher mua sắm',
      dataIndex: 'shoppingCard',
      width: 250,
      align: 'right' as 'right',

      render: (e: any, record: any, a: any) => {
        return <p>{StringHelper.formatVNDWithZeroNumber(e)}</p>;
      },
    },
    {
      title: 'Voucher giảm giá Flexpay (tối đa)',
      dataIndex: 'discount',
      width: 250,
      align: 'right' as 'right',

      render: (e: any, record: any, a: any) => {
        return <p>{StringHelper.formatVNDWithZeroNumber(e)}</p>;
      },
    },
    {
      title: 'Tiền mặt',
      dataIndex: 'cash',
      width: 250,
      align: 'right' as 'right',

      render: (e: any, record: any, a: any) => {
        return <p>{StringHelper.formatVNDWithZeroNumber(e)}</p>;
      },
    },
    {
      title: 'Tổng số tiền thưởng tích lũy',
      dataIndex: 'accumulate',
      width: 250,
      align: 'right' as 'right',

      render: (e: any, record: any, a: any) => {
        return (
          <p>
            {StringHelper.formatVNDWithZeroNumber(
              record.cash +
                record.shoppingCard +
                record.phoneCard +
                record.discount
            )}
          </p>
        );
      },
    },
    {
      title: 'Số tiền thưởng đã chi',
      dataIndex: 'paid',
      width: 250,
      align: 'right' as 'right',

      render: (e: any, record: any, a: any) => {
        return <p>{StringHelper.formatVNDWithZeroNumber(e)}</p>;
      },
    },
    {
      title: 'Số tiền thưởng chưa chi',
      dataIndex: 'notSpending',
      width: 250,
      align: 'right' as 'right',

      render: (e: any, record: any, a: any) => {
        return (
          <p>
            {StringHelper.formatVNDWithZeroNumber(
              record.cash +
                record.shoppingCard +
                record.phoneCard +
                record.discount -
                record.paid
            )}
          </p>
        );
      },
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
        {showFilter && (
          <OverviewFilter onFilter={setFilter} refetch={refetch} />
        )}
        <Table
          data={getTableData()}
          columns={columns}
          scroll={{ x: 2800, y: 400 }}
          emptyText={'Không có kết quả'}
          summary={(dataSummary: any) => {
            let totalPhoneCard = 0;
            let totalShoppingCard = 0;
            let totalCash = 0;
            let totalPaid = 0;
            let totalAccumulate = 0;
            let totalNotSpending = 0;
            let totalDiscount = 0;
            dataSummary.forEach(
              ({
                phoneCard,
                shoppingCard,
                cash,
                paid,
                discount,
              }: {
                phoneCard: any;
                shoppingCard: any;
                cash: any;
                paid: any;
                discount: any;
              }) => {
                totalPhoneCard += phoneCard;
                totalShoppingCard += shoppingCard;
                totalCash += cash;
                totalPaid += paid;
                totalAccumulate += phoneCard + shoppingCard + cash + discount;
                totalNotSpending +=
                  phoneCard + shoppingCard + cash + discount - paid;
                totalDiscount += discount;
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
                      <Table.Summary.Cell index={4}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalPhoneCard
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalShoppingCard
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalDiscount
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(totalCash)}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalAccumulate
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(totalPaid)}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={10}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalNotSpending
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={11} />
                    </Table.Summary.Row>
                    <Table.Summary.Row className="total">
                      <Table.Summary.Cell index={0} colSpan={2}>
                        Tổng giao dịch
                      </Table.Summary.Cell>
                      {/* <Table.Summary.Cell index={1} /> */}
                      <Table.Summary.Cell index={2} />
                      <Table.Summary.Cell index={3} />
                      <Table.Summary.Cell index={4}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalData?.totalPhone
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalData?.totalShopee
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalData?.totalDiscount
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalData?.totalCash
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalData?.totalPhone +
                                totalData?.totalShopee +
                                totalData?.totalCash +
                                totalData?.totalDiscount
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalData?.totalPaid
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={10}>
                        <div className="float-right">
                          <p>
                            {StringHelper.formatVNDWithZeroNumber(
                              totalData?.totalNotPaid
                            )}
                          </p>
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={11} />
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
