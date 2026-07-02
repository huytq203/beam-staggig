import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { Typography, Modal } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { MissionReferrerFilter } from './MissionReferrerFilter';
import { LuckyBoxService } from '@services/lucky-box';
import { IconEyeOpened } from '@douyinfe/semi-icons';
import { MissionReferrerDetailList } from './MissionReferrerDetailList';
export const MissionReferrerList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const { authCheckByRole } = useAuth();
  const router = useRouter();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
    UserRole.ACCOUNTANT,
  ]);
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
  const { Text } = Typography;
  const { data, isLoading, refetch } = useQuery(
    ['friend-invitation', filter],
    () => LuckyBoxService.getAllFriendInvitation(filter),
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
        return (
          <Text
            link
            onClick={() =>
              router.push(
                `/invite-friends/invitation-list/referrer?phoneNumber=${e}`
              )
            }
          >
            {e}
          </Text>
        );
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Doanh nghiệp',
      dataIndex: 'companyName',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Số người đăng ký Flexpay',
      dataIndex: 'installAppCount',
      width: 180,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Số người ĐKUL',
      dataIndex: 'registerSalaryAdvanceCount',
      width: 180,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Số người ứng lương',
      dataIndex: 'salaryAdvanceCount',
      width: 180,
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
          <MissionReferrerFilter onFilter={setFilter} refetch={refetch} />
        )}

        <AppTable
          size="small"
          loading={isLoading}
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
        <MissionReferrerDetailList openModal={openModal} />
      </Modal>
    </ContentWrapper>
  );
};
