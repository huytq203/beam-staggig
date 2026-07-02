import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { Modal, Typography } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { IconEyeOpened } from '@douyinfe/semi-icons';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { MissionCheckinFilter } from './MissionCheckinFilter';
import { LuckyBoxService } from '@services/lucky-box';
import { MisionCheckinDetailList } from './MisionCheckinDetail';
export const MissionCheckinList = (props: any) => {
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

  const [filter, setFilter] = useState<any>({
    page: 1,
    size: 10,
  });
  const [openModal, setOpenModal] = useState<any>({
    isOpenModal: false,
    phoneNumber: null,
    id: null,
  });
  const onClosePicker = () => {
    setOpenModal({
      phoneNumber: null,
      id: null,
      isOpenModal: false,
    });
  };
  const { data, isLoading, refetch } = useQuery(
    ['user-check-in', filter],
    () => LuckyBoxService.getUserCheckedin(filter),
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
      width: 150,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'employeeName',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Doanh nghiệp',
      dataIndex: 'companyName',
      width: 280,
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      width: 180,
      render: (e: any) => <>{e}</>,
    },
    {
      title: 'Số lần đăng nhập/tháng',
      dataIndex: 'checkInCount',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Chi tiết',
      dataIndex: 'id',
      width: 120,
      render: (e: any, record: any, a: any) => {
        return (
          <p>
            <IconEyeOpened
              className="cursor-pointer"
              onClick={() => {
                setOpenModal({
                  isOpenModal: true,
                  phoneNumber: record.phoneNumber,
                  id: record.id,
                });
              }}
            />
          </p>
        );
      },
    },
  ];

  return (
    <ContentWrapper pageTitle="Danh sách tham gia">
      <div className="flex flex-col gap-5">
        {showFilter && (
          <MissionCheckinFilter onFilter={setFilter} refetch={refetch} />
        )}

        <AppTable
          size="small"
          // loading={isLoading}
          columns={columns}
          className="beam-break-world"
          dataSource={getTableData()}
          scroll={{ x: 'scroll' }}
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
      <Modal
        visible={openModal?.isOpenModal}
        onCancel={onClosePicker}
        footer={['']}
        width={1200}
        bodyStyle={{
          overflow: 'auto',
        }}
      >
        <MisionCheckinDetailList openModal={openModal} />
      </Modal>
    </ContentWrapper>
  );
};
