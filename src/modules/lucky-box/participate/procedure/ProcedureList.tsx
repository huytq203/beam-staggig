import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { LuckyBoxService } from '@services/lucky-box';
import { ProcedureFilter } from './ProcedureFilter';
export const ProcedureList = (props: any) => {
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

  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['user-join-service', filter],
    () => LuckyBoxService.getUserProcedure(filter),
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
      title: 'Nhiệm vụ',
      dataIndex: 'step',
      width: 250,
      render: (e: any, record: any, a: any) => {
        let label = '';
        switch (e) {
          case 'REGISTER':
            label = 'Đăng ký sử dụng dịch vụ lần đầu';
            break;
          case 'TRANSFER':
            label = 'Ứng lương lần đầu';
            break;
        }
        return <p className="beam-break-world">{label}</p>;
      },
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: 'actionTime',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
  ];

  return (
    <ContentWrapper pageTitle="Danh sách hoàn tất thủ tục">
      <div className="flex flex-col gap-5">
        {showFilter && (
          <ProcedureFilter onFilter={setFilter} refetch={refetch} />
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
    </ContentWrapper>
  );
};
