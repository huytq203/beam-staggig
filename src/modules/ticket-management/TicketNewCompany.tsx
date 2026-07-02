import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { COMMON_FORMAT } from '@constants/common-format';
import { Modal, Notification, Switch, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TicketService } from '@services/ticket-management';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';

export const TicketNewCompany = (props: any) => {
  const { setCheckData } = props;
  const [filter, setFilter] = useState({
    keyword: '',
    page: 1,
    size: 10,
    status: 0,
  });
  const router = useRouter();

  const groupId = router.query.registerCompany;
  const { data, isLoading, refetch } = useQuery(
    ['new-company-list', filter],
    () =>
      TicketService.getTicketNewCompany({
        ...filter,
        groupId: groupId,
      }),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  useEffect(() => {
    refetch();
  }, [groupId]);

  const { Text } = Typography;
  const onClickAction = (record: any) => {
    const onDisable = async (id: any) => {
      const data = await TicketService.disContactTicketCompany(id);
      return data;
    };

    const onEnable = async (id: any) => {
      const data = await TicketService.contactTicketCompany(id);
      return data;
    };

    const onProcessStatus = (record: any) => {
      if (record.contactStatus === 'CONTACT') {
        return onDisable(record.id);
      } else {
        return onEnable(record.id);
      }
    };
    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Huỷ',
      okText: 'Thực hiện',
      onOk: async () => {
        const data = await onProcessStatus(record);
        if (data) {
          Notification.success({
            content: `Thay đổi trạng thái thành công`,
            theme: 'light',
          });
          refetch();
        }
      },
      content:
        'Bạn có chắc chắn muốn chuyển trạng thái liên hệ của yêu cầu này không?',
    });
  };
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
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 250,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'contactNumber',
      width: 180,
    },
    {
      title: 'Số CMND/CCCD/Hộ chiếu',
      dataIndex: 'identityNumber',
      width: 180,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
    },
    {
      title: 'Thời gian làm việc',
      dataIndex: 'workingTime',
      width: 250,
      render: (e: any) => {
        let label = '';
        switch (e) {
          case 'UNDER1':
            label = 'Dưới 1 năm';
            break;
          case 'FROM1TO3':
            label = 'Từ 1 đến 3 năm';
            break;
          case 'FROM3TO5':
            label = 'Từ 3 đến 5 năm';
            break;
          case 'OVER5':
            label = 'Trên 5 năm';
            break;
        }
        return <p>{label}</p>;
      },
    },
    {
      title: 'Nội dung yêu cầu',
      dataIndex: 'description',
      width: 250,
      render: (e: any) => <TextOverflow children={e} />,
    },

    {
      title: 'Liên hệ',
      dataIndex: 'contactStatus',
      width: 120,
      render: (e: any, record: any) => (
        <ProtectedWrapper
          allowedRoles={[
            UserRole.BEAM_ADMIN,
            UserRole.SUPER_ADMIN,
            UserRole.CUSTOMER_SERVICE,
            UserRole.SALE,
          ]}
        >
          <Switch
            checked={e === 'CONTACT'}
            onChange={() => onClickAction(record)}
          />
        </ProtectedWrapper>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Ngày liên hệ',
      dataIndex: 'contactTime',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
  ];
  useEffect(() => {
    if (!data && !isLoading) {
      setCheckData(false);
    }
  }, [isLoading]);
  if (isLoading) return <></>;
  return (
    <div>
      {/* <div className="px-6 pt-6">
        <div className="flex flex-col gap-5 mb-5">
          <TicketManagementFilter onFilter={setFilter} />
        </div>
      </div> */}

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
    </div>
  );
};
