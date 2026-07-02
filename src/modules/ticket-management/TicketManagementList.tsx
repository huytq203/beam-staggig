import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { TicketManagementFilter } from './TicketManagementListFilter';
import { ContentWrapper } from '@components/widgets';
import { TicketService } from '@services/ticket-management';

export const TicketManagementList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true, companyId } = props;
  const [filter, setFilter] = useState({
    searchWord: '',
    page: 1,
    size: 10,
    status: 0,
    companyId: '',
  });

  const { data, isLoading, refetch } = useQuery(
    ['new-company-list', filter],
    () => TicketService.getAllTicketNewCompany(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
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
      title: 'Doanh nghiệp',
      dataIndex: 'companyName',
      width: 250,
      render: (name: any, record: any, a: any) => {
        return (
          <Text>
            <span className="beam-break-world">{name}</span>
          </Text>
        );
      },
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxNumber',
      width: 250,
    },
    {
      title: 'Số lần đăng ký',
      dataIndex: 'requestNumber',
      width: 150,
    },
    {
      title: 'Loại yêu cầu',
      dataIndex: 'type',
      width: 200,
      render: (e: any) => <p>Đăng ký công ty mới</p>,
    },
    {
      title: 'Ngày liên hệ',
      dataIndex: 'contactTime',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Ngày đăng ký mới nhất',
      dataIndex: 'createdAt',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    // {
    //   title: 'Trạng thái',
    //   dataIndex: 'status',
    //   width: 150,
    //   render: (x: any) => {
    //     let label = '';
    //     let className: any = '';

    //     switch (x) {
    //       case 0:
    //         label = 'Chờ duyệt';
    //         className = 'yellow';
    //         break;
    //       case 1:
    //         label = 'Đã duyệt';
    //         className = 'green';
    //         break;
    //       case 2:
    //         label = 'Từ chối';
    //         className = 'red';
    //         break;
    //     }
    //     return (
    //       <Tag size="small" color={className}>
    //         {label}
    //       </Tag>
    //     );
    //   },
    // },
    {
      title: 'Thông tin yêu cầu',
      dataIndex: 'id',
      width: 150,
      render: (id: any, record: any) => (
        <Text
          link
          onClick={() =>
            router.push(`/ticket-management/${id}/ticket-register-company`)
          }
        >
          Xem chi tiết
        </Text>
      ),
    },
  ];

  return (
    <div>
      <div className="px-6 pt-6">
        <div className="flex flex-col gap-5 mb-5">
          <TicketManagementFilter onFilter={setFilter} refetch={refetch} />
        </div>
      </div>
      <ContentWrapper>
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
      </ContentWrapper>
    </div>
  );
};
