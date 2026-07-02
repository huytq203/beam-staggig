import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconEdit } from '@douyinfe/semi-icons';
import { Modal, Notification, Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TicketService } from '@services/ticket-management';
import { FilterTicket } from './FilterTicketCompany';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import ImportTicketForm from '@modules/companies/tickets/form/ImportTicketForm';
import { ProtectedWrapper } from '@components/widgets/Auth';

const ErrorMap: { [key: string]: string } = {
  TICKET_ACCEPTED_BY_OTHER: 'Đã được xử lý. Vui lòng kiểm tra lại.',
  SKIP_TO_PROCESS_MANUALLY:
    'Với loại yêu cầu đăng ký mới, vui lòng duyệt yêu cầu bằng tay.',
  EXISTED_EMPLOYEE_CODE: 'Mã nhân viên đã tồn tại trong doanh nghiệp',
};

const getMessage = (messageCode: string, type: string) => {
  if (messageCode in ErrorMap) {
    return ErrorMap[messageCode];
  } else {
    if (type === 'ACCEPT') {
      return 'Phê duyệt không thành công.';
    } else {
      return 'Từ chối không thành công.';
    }
  }
};

const ResultRender = (props: any) => {
  const { result, type } = props;
  return (
    <div className="flex flex-col gap-4 py-4 max-h-96 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <div className="font-bold">Xử lý lỗi({result?.error?.length})</div>
        {result?.error?.map((message: any, key: number) => {
          return (
            <div key={key}>
              <p key={key}>
                {key + 1}. Yêu cầu {message?.ticketCode}
                {': '}
                {getMessage(message?.errorCode, type)}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 ">
        <div className="font-bold">
          Xử lý thành công({result.success.length})
        </div>
        {result.success.map((message: any, key: number) => {
          if (type === 'ACCEPT') {
            return (
              <div key={key}>
                {key + 1}. Yêu cầu {message?.ticketCode}: Phê duyệt thành công
              </div>
            );
          } else {
            return (
              <div key={key}>
                {key + 1}. Yêu cầu {message?.ticketCode}: Từ chối thành công
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

type ActionType = 'REJECT' | 'ACCEPT';

export const ListTicketCompany = (props: any) => {
  const {
    basePath,
    showFilter = true,
    companyId,
    setFilterExport,
    isOpenUploadFile,
    setIsOpenUploadFile,
    isSelectBatch,
    setIsSelectBatch,
  } = props;
  const [selectedTicketIds, setSelectedTicketIds] = useState<String[]>([]);
  const [loading, setLoading] = useState(false);

  const onClickSubmitTicketBatch = async (type: ActionType) => {
    if (selectedTicketIds == null || selectedTicketIds.length == 0) {
      Notification.error({
        content: `Bạn chưa chọn yêu cầu nào!`,
        theme: 'light',
      });
      return;
    }

    setLoading(true);
    const data = {
      ticketIds: selectedTicketIds,
      type: type,
    };
    const result = await TicketService.acceptTicketList(data);
    Modal.success({
      title: 'Kết quả xử lý yêu cầu',
      cancelText: '',
      okText: 'Đồng ý',
      cancelButtonProps: { style: { display: 'none' } },
      content: <ResultRender type={type} result={result}></ResultRender>,
      width: '600px',
    });
    setLoading(false);
    setSelectedTicketIds([]);
    reFetchTicketData();
  };

  const initialFilterState = {
    searchWord: '',
    page: 1,
    size: 10,
    type: '',
    subtype: 'ALL',
    status: '',
    sort: ['status,asc'],
  };

  const [filter, setFilter] = useState(initialFilterState);

  const resetFilter = () => {
    setFilter(initialFilterState);
  };

  const { authCheckByRole, profile } = useAuth();
  const router = useRouter();

  const {
    data,
    isLoading,
    refetch: reFetchTicketData,
  } = useQuery(
    ['campaign-list', filter, router.query?.companyId],
    () => TicketService.getAll(filter, router.query?.companyId),
    {
      enabled:
        router.query?.companyId !== null &&
        router.query?.companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const rowSelection: any = {
    selectedRowKeys: selectedTicketIds,
    getCheckboxProps: (record: any) => ({
      disabled: record.status != 0,
      name: record.id,
    }),
    onSelect: (record: any, selected: boolean) => {},
    onSelectAll: (selected: boolean, selectedRows: any, changedRows: any) => {
      if (!selected) {
        setSelectedTicketIds([]);
      }
    },
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedTicketIds(selectedRowKeys);
    },
  };

  const {
    data: isShowTicket,
    isLoading: isLoadingTicket,
    isFetching: isFetchingTicket,
    refetch: reFetchTicket,
  } = useQuery(
    ['show-ticket', router.query?.companyId],
    async () => {
      const response = await TicketService.checkHideFeatureTicket(
        router.query?.companyId
      );
      return response;
    },
    {
      enabled:
        router.query?.companyId !== undefined &&
        router.query?.companyId !== null,
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
      isShowTicket?.canShowTicket == false
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

  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 50,
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
        return record.type == 'INFORMATION' ? (
          <Text
            onClick={() =>
              router.push(`${basePath}/${record.id}/ticket-update-information`)
            }
            link
          >
            <span className="beam-break-world">{name}</span>
          </Text>
        ) : (
          <Text
            onClick={() =>
              router.push(`${basePath}/${record.id}/ticket-register-salary`)
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
      width: 120,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 220,
    },
    {
      title: 'Nhóm yêu cầu',
      dataIndex: 'type',
      width: 210,
      render: (x: any) => {
        let label = '';
        switch (x) {
          case 'INFORMATION':
            label = 'Cập nhật thông tin';
            break;
          case 'REGISTER_SALARY_ADVANCE':
            label = 'Đăng ký dịch vụ ứng lương';
            break;
        }
        return <p>{label}</p>;
      },
    },
    {
      title: 'Loại yêu cầu',
      dataIndex: 'subtype',
      width: 180,
      render: (x: any) => {
        let label = '';
        switch (x) {
          case 'CREATE':
            label = 'Đăng ký mới';
            break;
          case 'UPDATE':
            label = 'Cập nhật thông tin';
            break;
        }
        return <p>{label}</p>;
      },
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
      width: 130,
      render: (e: any, record: any) =>
        e == 'system' ? (
          <p>Hệ thống</p>
        ) : e == 'user' ? (
          <p>Người Dùng</p>
        ) : (
          <p>{e}</p>
        ),
    },
    {
      title: 'Cách thức xử lý',
      dataIndex: 'processType',
      width: 150,
      render: (x: any) => {
        let label = '';
        switch (x) {
          case 'MANUAL':
            label = 'Theo từng yêu cầu';
            break;
          case 'FILE':
            label = 'Theo file';
            break;
          case 'BATCH':
            label = 'Theo nhóm';
            break;
          case 'USER_MANUAL':
            label = 'Huỷ yêu cầu trên ứng dụng';
            break;
        }
        return <p className="beam-break-world">{label}</p>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 0:
            label = 'Chờ phê duyệt';
            className = 'yellow';
            break;
          case 1:
            label = 'Đã phê duyệt';
            className = 'green';
            break;
          case 2:
            label = 'Từ chối';
            className = 'red';
            break;
          case 3:
            label = 'Huỷ';
            className = 'red';
            break;
        }
        return (
          <Tag size="small" color={className}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      width: 150,
      render: (id: any, record: any) => {
        return record.type == 'INFORMATION' && record.status == 0 ? (
          <IconEdit
            onClick={() =>
              router.push(`${basePath}/${record.id}/ticket-update-information`)
            }
            className="cursor-pointer"
          />
        ) : record.type == 'REGISTER_SALARY_ADVANCE' && record.status == 0 ? (
          <IconEdit
            onClick={() =>
              router.push(`${basePath}/${id}/ticket-register-salary`)
            }
            className="cursor-pointer"
          />
        ) : (
          ''
        );
      },
    },
  ];

  useEffect(() => {
    setFilterExport({
      companyId: companyId,
      searchWord: filter.searchWord,
      type: filter.type,
      status: filter.status,
      subtype: filter.subtype,
    });
  }, [filter]);

  return (
    <div>
      {isOpenUploadFile ? (
        <ImportTicketForm
          companyId={companyId}
          onCancel={() => {
            setIsOpenUploadFile(false);
            setIsSelectBatch(false);
            resetFilter();
            reFetchTicketData();
          }}
          reFetchTicket={reFetchTicketData}
        ></ImportTicketForm>
      ) : (
        <div>
          <div className="px-6 pt-6">
            <div className="flex flex-col gap-5 mb-5">
              <ProtectedWrapper
                allowedRoles={[
                  UserRole.BEAM_ADMIN,
                  UserRole.RECONCILER,
                  UserRole.CONTROLLER,
                  UserRole.CUSTOMER_SERVICE,
                  UserRole.HR_ADMIN,
                ]}
              >
                <FilterTicket
                  onFilter={setFilter}
                  companyId={companyId}
                  refetch={reFetchTicketData}
                  isSelectBatch={isSelectBatch}
                  acceptTicket={() => onClickSubmitTicketBatch('ACCEPT')}
                  rejectTicket={() => onClickSubmitTicketBatch('REJECT')}
                />
              </ProtectedWrapper>
            </div>
          </div>
          {/* <ContentWrapper> */}
          <AppTable
            size="small"
            loading={isLoading}
            columns={columns}
            className="beam-break-world"
            dataSource={getTableData()}
            rowKey={'id'}
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
            rowSelection={isOpenUploadFile ? null : rowSelection}
          />
        </div>
      )}
    </div>
  );
};
