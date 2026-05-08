import { AppPagination } from '@components/shared';
// import AppTable from '@components/shared/AppTable/AppTable';
import Table from 'rc-table';
import { COMMON_FORMAT } from '@constants/common-format';
import { Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { PresenteeFilter } from './PresenteeFilter';
import { FriendInvatationService } from '@services/friend-invitation';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { useAuth } from '@contexts/authentication';
export const PresenteeList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    // name: '',
    page: 1,
    size: 10,
    // sort: ['createdAt,desc'],
  });

  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter],
    () => FriendInvatationService.getAllInvitedPeople(filter),
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
    if (isLoading || !data?.inviteds?.content) return [];
    return data?.inviteds?.content;
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 20,
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
      title: 'Người được giới thiệu',
      dataIndex: 'phoneNumber',
      align: 'right' as 'right',
      width: 70,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Tên doanh nghiệp người được giới thiệu',
      dataIndex: 'companyName',
      align: 'right' as 'right',
      width: 150,
      render: (e: any) => (
        <TextOverflow line={1} contentText={e}>
          <p className="hidden-word">{e}</p>
        </TextOverflow>
      ),
    },
    {
      title: 'Ngày đăng ký Flexpay',
      dataIndex: 'registerFlexpayDate',
      align: 'right' as 'right',
      width: 80,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Ngày đăng ký dịch vụ ứng lương',
      dataIndex: 'registerSalaryAdvanceDate',
      align: 'right' as 'right',
      width: 100,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Ngày khảo sát',
      dataIndex: 'ticketNewCompanyDate',
      align: 'right' as 'right',
      width: 50,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Ngày ứng lương lần đầu thành công',
      dataIndex: 'firstSalaryAdvanceDate',
      align: 'right' as 'right',
      width: 100,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Số tiền thưởng',
      dataIndex: 'reward',
      align: 'right' as 'right',
      width: 50,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'right' as 'right',
      width: 70,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 'EARNED':
            label = 'Đã chi thưởng';
            className = 'green';
            break;
          case 'PENDING':
            label = 'Chưa chi thưởng';
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
  ];

  return (
    <ContentWrapper pageTitle="Danh sách người được giới thiệu">
      <div className="flex flex-col gap-5">
        {showFilter && <PresenteeFilter onFilter={setFilter} />}

        <div className="transaction-list">
          <Table
            data={getTableData()}
            columns={columns}
            scroll={{ x: 1700, y: 400 }}
            emptyText={'Không có kết quả'}
            summary={(dataSummary: any) => {
              let totalReward = 0;

              dataSummary.forEach(({ reward }: { reward: any }) => {
                totalReward += reward;
              });
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
                        <Table.Summary.Cell index={7}>
                          <div className="float-right">
                            <p>{StringHelper.formatVND(totalReward)}</p>
                          </div>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={8} />
                        <Table.Summary.Cell index={9} />
                        <Table.Summary.Cell index={10} />
                        <Table.Summary.Cell index={11} />
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
                        <Table.Summary.Cell index={7}>
                          <div className="float-right">
                            <p>{StringHelper.formatVND(data?.rewardTotal)}</p>
                          </div>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={8} />
                        <Table.Summary.Cell index={9} />
                        <Table.Summary.Cell index={10} />
                        <Table.Summary.Cell index={11} />
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
            {...data?.inviteds}
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
