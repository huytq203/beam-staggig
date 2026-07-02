import { AppPagination } from '@components/shared';
// import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Table from 'rc-table';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { ReferrerFilter } from './ReferrerFilter';
import { FriendInvatationService } from '@services/friend-invitation';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { useAuth } from '@contexts/authentication';
export const ReferrerList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
    // sort: ['createdAt,desc'],
  });

  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter],
    () => FriendInvatationService.getAllInviter(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
    UserRole.RECONCILER,
    UserRole.ACCOUNTANT,
  ]);
  const { Text } = Typography;

  const router = useRouter();
  const getTableData = () => {
    if (isLoading || !data?.inviters?.content) return [];
    return data?.inviters?.content;
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 50,
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
      title: 'Người giới thiệu',
      dataIndex: 'phoneNumber',
      align: 'right' as 'right',
      width: 130,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Tên người giới thiệu',
      dataIndex: 'name',
      width: 140,
      align: 'right' as 'right',
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Tên doanh nghiệp người giới thiệu',
      dataIndex: 'companyName',
      width: 200,
      align: 'right' as 'right',
      render: (e: any) => (
        <TextOverflow line={1} contentText={e}>
          <p className="hidden-word">{e}</p>
        </TextOverflow>
      ),
    },
    {
      title: 'Người được giới thiệu',
      dataIndex: 'invitedPhoneNumber',
      width: 120,
      align: 'right' as 'right',
      render: (e: any) => <p className="beam-break-world">{e}</p>,
    },

    {
      title: 'Người được giới thiệu',
      children: [
        {
          title: 'Ngày đăng ký Flexpay',
          dataIndex: 'registerFlexpayDate',
          width: 130,
          align: 'right' as 'right',
          render: (e: any) => (
            <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
          ),
        },
        {
          title: 'Ngày đăng ký dịch vụ ứng lương',
          dataIndex: 'registerSalaryAdvanceDate',
          width: 180,
          align: 'right' as 'right',
          render: (e: any) => (
            <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
          ),
        },
        {
          title: 'Ngày khảo sát',
          dataIndex: 'ticketNewCompanyDate',
          width: 100,
          align: 'right' as 'right',
          render: (e: any) => (
            <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
          ),
        },
        {
          title: 'Ngày ứng lương lần đầu thành công',
          dataIndex: 'firstSalaryAdvanceDate',
          width: 200,
          align: 'right' as 'right',
          render: (e: any) => (
            <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
          ),
        },
      ],
    },
    {
      title: 'Người giới thiệu',
      children: [
        {
          title: 'Tiền thưởng đăng ký dịch vụ ứng lương',
          dataIndex: 'registerSalaryAdvanceReward',
          width: 230,
          align: 'right' as 'right',
          render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
        },
        {
          title: 'Tiền thưởng khảo sát',
          dataIndex: 'ticketNewCompanyReward',
          width: 150,
          align: 'right' as 'right',
          render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
        },
        {
          title: 'Tiền thưởng ứng lương lần đầu thành công',
          dataIndex: 'firstSalaryAdvanceReward',
          width: 230,
          align: 'right' as 'right',
          render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
        },
      ],
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedDate',
      width: 130,
      align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
  ];

  return (
    <ContentWrapper pageTitle="Danh sách người giới thiệu">
      <div className="flex flex-col gap-5">
        {showFilter && (
          <ReferrerFilter onFilter={setFilter} refetch={refetch} />
        )}

        <div className="transaction-list">
          <Table
            data={getTableData()}
            columns={columns}
            scroll={{ x: 2750, y: 400 }}
            emptyText={'Không có kết quả'}
            summary={(dataSummary: any) => {
              let totalRegisterSalaryAdvanceReward = 0;
              let totalFirstSalaryAdvanceReward = 0;
              let totalTicketNewCompanyReward = 0;

              dataSummary.forEach(
                ({
                  registerSalaryAdvanceReward,
                  ticketNewCompanyReward,
                  firstSalaryAdvanceReward,
                }: {
                  registerSalaryAdvanceReward: any;
                  ticketNewCompanyReward: any;
                  firstSalaryAdvanceReward: any;
                }) => {
                  totalRegisterSalaryAdvanceReward +=
                    registerSalaryAdvanceReward;
                  totalFirstSalaryAdvanceReward += firstSalaryAdvanceReward;
                  totalTicketNewCompanyReward += ticketNewCompanyReward;
                }
              );
              return (
                <Table.Summary fixed={true}>
                  {data && (
                    <>
                      <Table.Summary.Row className="total-page">
                        <Table.Summary.Cell index={0} colSpan={2}>
                          Tổng tiền thưởng trang
                        </Table.Summary.Cell>
                        {/* <Table.Summary.Cell index={1} /> */}
                        <Table.Summary.Cell index={2} />
                        <Table.Summary.Cell index={3} />
                        <Table.Summary.Cell index={4} />
                        <Table.Summary.Cell index={5} />
                        <Table.Summary.Cell index={6} />
                        <Table.Summary.Cell index={7} />
                        <Table.Summary.Cell index={8} />
                        <Table.Summary.Cell index={9}>
                          <div className="float-right">
                            <p>
                              {StringHelper.formatVND(
                                totalRegisterSalaryAdvanceReward
                              )}
                            </p>
                          </div>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={10}>
                          <div className="float-right">
                            <p>
                              {StringHelper.formatVND(
                                totalTicketNewCompanyReward
                              )}
                            </p>
                          </div>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={11}>
                          <div className="float-right">
                            <p>
                              {StringHelper.formatVND(
                                totalFirstSalaryAdvanceReward
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
                        <Table.Summary.Cell index={19} />
                      </Table.Summary.Row>
                      <Table.Summary.Row className="total">
                        <Table.Summary.Cell index={0} colSpan={2}>
                          Tổng tiền thưởng
                        </Table.Summary.Cell>
                        {/* <Table.Summary.Cell index={1} /> */}
                        <Table.Summary.Cell index={2} />
                        <Table.Summary.Cell index={3} />
                        <Table.Summary.Cell index={4} />
                        <Table.Summary.Cell index={5} />
                        <Table.Summary.Cell index={6} />
                        <Table.Summary.Cell index={7} />
                        <Table.Summary.Cell index={8} />
                        <Table.Summary.Cell index={9}>
                          <div className="float-right">
                            <p>
                              {StringHelper.formatVND(
                                data?.registerSalaryAdvanceRewardTotal
                              )}
                            </p>
                          </div>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={10}>
                          <div className="float-right">
                            <p>
                              {StringHelper.formatVND(
                                data?.ticketNewCompanyRewardTotal
                              )}
                            </p>
                          </div>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={11}>
                          <div className="float-right">
                            <p>
                              {StringHelper.formatVND(
                                data?.firstSalaryAdvanceRewardTotal
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
                        <Table.Summary.Cell index={19} />
                      </Table.Summary.Row>
                    </>
                  )}
                </Table.Summary>
              );
            }}
          />
        </div>
        <div className="py-2 w-full flex justify-end">
          <AppPagination
            {...data?.inviters}
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
