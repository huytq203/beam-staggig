import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT, TIMEZONE_FORMAT } from '@constants/common-format';
import { Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { MissionCheckinDetailFilter } from './MissionCheckinDetailFilter';
import { LuckyBoxService } from '@services/lucky-box';
export const MisionCheckinDetailList = (props: any) => {
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
    startTime: '',
    endTime: '',
    page: 1,
    size: 10,
  });
  const { data, isLoading, refetch } = useQuery(
    ['user-check-in', filter],
    () => LuckyBoxService.getUserCheckedinDetial(filter),
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
      width: 180,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Thời gian gian đăng nhập',
      dataIndex: 'loginTime',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
  ];

  return (
    // <ContentWrapper pageTitle="Danh sách tham gia">
    <div className="flex flex-col gap-5">
      {showFilter && (
        <MissionCheckinDetailFilter
          onFilter={setFilter}
          filter={filter}
          refetch={refetch}
        />
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
    // </ContentWrapper>
  );
};
