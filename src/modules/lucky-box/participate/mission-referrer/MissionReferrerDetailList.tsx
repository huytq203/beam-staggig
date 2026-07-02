import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { Typography } from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import { MissinReferrerDetailFilter } from './MissionReferrerDetailFilter';
import { FriendInvatationService } from '@services/friend-invitation';
import { IconTickCircle } from '@douyinfe/semi-icons';

export const MissionReferrerDetailList = (props: any) => {
  const { openModal, showFilter = true } = props;
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
    phoneNumber: openModal?.phoneNumber,
    page: 1,
    size: 10,
  });
  const { data, isLoading, refetch } = useQuery(
    ['user-check-in', filter],
    () => FriendInvatationService.getInvitedProcedure(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    const tranformData = data?.content.map((data: any) => ({
      ...data,
      registerFlexpay: data?.completedSteps?.includes('REGISTER_FLEXPAY'),
      registerSalaryAdvance: data?.completedSteps?.includes(
        'REGISTER_SALARY_ADVANCE'
      ),
      salaryAdvance: data?.completedSteps?.includes('FIRST_SALARY_ADVANCE'),
    }));
    return tranformData;
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
      dataIndex: 'toUser',
      width: 150,
      render: (e: any, record: any, a: any) => {
        return <Text>{e}</Text>;
      },
    },
    {
      title: 'Đăng ký Flexpay',
      dataIndex: 'registerFlexpay',
      width: 180,
      render: (e: any) => {
        return <p>{e ? <IconTickCircle style={{ color: 'green' }} /> : ''}</p>;
      },
    },
    {
      title: 'ĐKƯL',
      dataIndex: 'registerSalaryAdvance',
      width: 180,
      render: (e: any) => {
        return <p>{e ? <IconTickCircle style={{ color: 'green' }} /> : ''}</p>;
      },
    },
    {
      title: 'Ứng lương',
      dataIndex: 'salaryAdvance',
      width: 180,
      render: (e: any) => {
        return <p>{e ? <IconTickCircle style={{ color: 'green' }} /> : ''}</p>;
      },
    },
  ];
  return (
    // <ContentWrapper pageTitle="Danh sách tham gia">
    <div className="flex flex-col gap-5">
      {/* {showFilter && (
        <MissionReferrerDetailFilter
          onFilter={setFilter}
          filter={filter}
          refetch={refetch}
        />
      )} */}

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
    // </ContentWrapper>
  );
};
