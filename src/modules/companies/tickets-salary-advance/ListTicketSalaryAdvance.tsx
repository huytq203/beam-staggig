import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconEdit } from '@douyinfe/semi-icons';
import { Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TicketService } from '@services/ticket-management';
import { FilterTicketSalaryAdvance } from './FilterTicketSalaryAdvance';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';

export const ListTicketSalaryAdvance = (props: any) => {
  const { basePath, companyId } = props;
  const [filter, setFilter] = useState({
    keyword: '',
    page: 1,
    size: 10,
    sort: [],
    transactionStatus: 'ALL',
    ticketStatus: 'ALL',
  });
  const { authCheckByRole, profile } = useAuth();
  const { query } = useRouter();

  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter, query?.companyId],
    () => TicketService.getAllTicketSalaryAdvance(filter, query?.companyId),
    {
      enabled: query?.companyId !== null && query?.companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const {
    data: isShowTicket,
    isLoading: isLoadingTicket,
    isFetching: isFetchingTicket,
    refetch: reFetchTicket,
  } = useQuery(
    ['show-ticket', query?.companyId],
    async () => {
      const response = await TicketService.checkHideFeatureTicket(
        query?.companyId
      );
      return response;
    },
    {
      enabled: query?.companyId !== undefined && query?.companyId !== null,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.HR_ADMIN,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
    UserRole.RECONCILER,
    UserRole.SALE,
    UserRole.ACCOUNTANT,
  ]);
  useEffect(() => {
    if (
      profile?.roles[0] == UserRole.HR_ADMIN &&
      !isShowTicket?.canShowTicketSalaryAdvance
    ) {
      authCheckByRole([
        UserRole.BEAM_ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.CUSTOMER_SERVICE,
        UserRole.CONTROLLER,
        UserRole.RECONCILER,
        UserRole.SALE,
        UserRole.ACCOUNTANT,
      ]);
    }
  }, [isLoadingTicket, isFetchingTicket]);
  const { Text } = Typography;

  const router = useRouter();

  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      render: (name: any, record: any, index: any) => {
        return (
          <Text>
            <span>{StringHelper.indexTable(filter.page, index)}</span>
          </Text>
        );
      },
    },
    {
      title: 'Mã yêu cầu',
      dataIndex: 'code',
      width: 150,
      render: (name: any, record: any, a: any) => {
        return (
          <Text
            onClick={() =>
              router.push(
                `${basePath}/${record.id}/ticket-salary-advance-detail`
              )
            }
            link
          >
            <span className="beam-break-world">{name}</span>
          </Text>
        );
      },
    },

    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      width: 180,
    },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'requestTime',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Ngày xử lý',
      dataIndex: 'processTime',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Người xử lý',
      dataIndex: 'processedBy',
      width: 150,
      render: (e: any, record: any) =>
        e == 'system' ? (
          <p>Hệ thống</p>
        ) : e == 'enduser' || e == 'Enduser' ? (
          'Người dùng'
        ) : (
          <p>{e}</p>
        ),
    },
    {
      title: 'Ngày chuyển tiền',
      dataIndex: 'transferTime',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Trạng thái yêu cầu',
      dataIndex: 'status',
      width: 150,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 'PENDING':
            label = 'Chờ xử lý';
            className = 'yellow';
            break;
          case 'ACCEPTED':
            label = 'Phê duyệt';
            className = 'light-blue';
            break;
          case 'REJECTED':
            label = 'Từ chối';
            className = 'red';
            break;
          case 'FAIL':
            label = 'Lỗi';
            className = 'red';
            break;
          case 'SUCCESS':
            label = 'Thành công';
            className = 'green';
            break;
          case 'CANCELLED':
            label = 'Huỷ';
            className = 'grey';
            break;
        }
        return (
          <Tag size="small" color={className} shape="square">
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái giao dịch',
      dataIndex: 'transferStatus',
      width: 180,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 'PENDING':
            label = 'Chờ xử lý';
            className = 'yellow';
            break;
          case 'FAIL':
            label = 'Lỗi';
            className = 'red';
            break;
          case 'SUCCESS':
            label = 'Thành công';
            className = 'green';
            break;
        }
        return (
          <Tag size="small" color={className} shape="square">
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      width: 130,
      render: (id: any, record: any) => {
        return record.status == 'PENDING' ? (
          <IconEdit
            onClick={() =>
              router.push(`${basePath}/${id}/ticket-salary-advance-detail`)
            }
            className="cursor-pointer"
          />
        ) : (
          ''
        );
      },
    },
  ];

  return (
    <div>
      <div className="px-6 pt-6">
        <div className="flex flex-col gap-5 mb-5">
          <FilterTicketSalaryAdvance
            onFilter={setFilter}
            companyId={companyId}
            refetch={refetch}
          />
        </div>
      </div>
      {/* <ContentWrapper> */}
      <AppTable
        size="small"
        loading={isLoading}
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
      {/* </ContentWrapper> */}
    </div>
  );
};
