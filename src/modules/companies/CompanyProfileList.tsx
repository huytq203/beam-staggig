import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { TypeCompare } from '@constants/type-compare.constants';
import { Divider, Pagination, Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { CompanyService } from '@services/companies';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ProfileListFilter } from './ProfileListFilter';
import { useAuth } from '@contexts/authentication';

export const CompanyProfileList = (props: any) => {
  const { companyId, basePath } = props;
  const { Text } = Typography;
  const { profile } = useAuth();
  const userRoles = profile?.roles;
  const router = useRouter();
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10 ,
    sort: ['createdAt,desc'],
  });

  const { data, isLoading, refetch } = useQuery(
    ['profile-list', filter, companyId],
    () => CompanyService.getListProfile(companyId, filter),
    {
      enabled: companyId !== null && companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const columns = [
    {
      title: 'Hồ sơ',
      dataIndex: 'name',
      width: 150,
      // align: 'right' as 'right',
      render: (name: any, record: any, index: any) => (
        <Text onClick={() => router.push(`/${basePath}/${record.id}`)} link>
          <span className="beam-break-world">
            Hồ sơ #{StringHelper.indexTable(filter.page, index)}
          </span>
        </Text>
      ),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      width: 200,
      // align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      // align: 'right' as 'right',
      width: 200,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Tổng hạn mức',
      dataIndex: 'creditLimit',
      // align: 'right' as 'right',
      width: 150,
      render: (e: any) => <p>{StringHelper.formatVND(e)}</p>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      // align: 'right' as 'right',
      render: (x: any, record: any) => {
        let label = '';
        let className: any = '';
        let status = x;
        if (
          !DateTimeHelper.isAfter(record.startTime, null, TypeCompare.DAY) &&
          DateTimeHelper.isAfter(record.endTime, null, TypeCompare.DAY) &&
          status == 1
        ) {
          status = 3;
        }
        switch (status) {
          case 0:
            label = 'Hoạt động';
            className = 'green';
            break;
          case 1:
            label = 'Không hoạt động';
            className = 'grey';
            break;
          case 2:
            label = 'Hết hạn';
            className = 'teal';
            break;
          case 3:
            label = 'Tạm dừng hoạt động';
            className = 'cyan';
        }
        return (
          <Tag size="small" color={className}>
            {label}
          </Tag>
        );
      },
      width: 200,
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 180,
      // align: 'right' as 'right',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 250,
      // align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'updatedBy',
      width: 180,
      // align: 'right' as 'right',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 250,
      // align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Nội dung cập nhật',
      dataIndex: 'id',
      width: 180,
      // align: 'right' as 'right',
      render: (userId: any, record: any) => {
        return (
          <Text
            onClick={() => router.push(`/change-log/Profile/${record.id}`)}
            link
            className="beam-break-world"
          >
            Xem lịch sử
          </Text>
        );
      },
    },
  ];

  const getColumn = () => {
    if (['hr_admin'].includes(profile?.roles[0])) {
      return columns.filter((x: any) => x.title !== 'Nội dung cập nhật');
    }
    return columns;
  };

  const getTableData = () => {
    if (!data?.content) return [];
    return data?.content;
  };

  return (
    <>
      <ProfileListFilter onFilter={setFilter} refetch={refetch} />
      <Divider dashed />
      <AppTable
        loading={isLoading}
        columns={getColumn()}
        size="small"
        dataSource={getTableData()}
        renderPagination={(e: any) => {
          return (
            <div className="py-2 w-full flex justify-end">
              <Pagination
                currentPage={filter.page}
                total={data?.totalElements}
                pageSize={data?.pageSize}
                onChange={(e: any) => {
                  setFilter({
                    ...filter,
                    page: e,
                  });
                }}
                showTotal
              />
            </div>
          );
        }}
        rowKey="id"
      />
    </>
  );
};
