import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { Tag, Typography } from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { IconEdit } from '@douyinfe/semi-icons';
import { StringHelper } from '@helpers/string.helper';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UserRole } from '@constants/auth.constants';
import { ContentWrapper } from '@components/widgets';
import { useAuth } from '@contexts/authentication';
import { LuckyBoxService } from '@services/lucky-box';
import { listNameLuckyBox } from '@constants/listNameLuckyBox.constants';
export const BugetList = (props: any) => {
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
  const { Text } = Typography;

  const [filter, setFilter] = useState<any>({
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['user-buget', filter],
    () => LuckyBoxService.getAllBuget(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };

  const convertName = (name: any) => {
    const listName: any = listNameLuckyBox;

    if (!listName[name]) return name;

    return listName[name];
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
      title: 'Giải thưởng',
      dataIndex: 'name',
      width: 180,
      render: (e: any, record: any, a: any) => {
        let label = convertName(e);
        if (e == 'COMMON_LUCKY_BOX') {
          if (record.amount < 10) {
            label = `0${record.amount} ${label}`;
          } else {
            label = `${record.amount} ${label}`;
          }
        }
        return (
          <Text
            className="beam-break-world"
            link
            onClick={() => router.push(`/lucky-box/budget/${record.id}/edit`)}
          >
            <p className="beam-break-world">{label}</p>
          </Text>
        );
      },
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      width: 180,
      render: (e: any, record: any, a: any) => {
        return <p>{StringHelper.formatVND(e)}</p>;
      },
    },

    {
      title: 'Số lượng tối đa',
      dataIndex: 'sizeCap',
      width: 180,
      render: (e: any, record: any, a: any) => {
        return <p className="beam-break-world">{e}</p>;
      },
    },
    {
      title: 'Thành tiền',
      dataIndex: 'money',
      width: 180,
      render: (e: any, record: any) => <>{StringHelper.formatVND(e)}</>,
    },
    {
      title: 'Số lượng cài dặt',
      dataIndex: 'quantity',
      width: 180,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Đã nhận',
      dataIndex: 'totalWinners',
      width: 150,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Còn lại',
      dataIndex: 'remainingQuantity',
      width: 150,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return (
          <p>{DateTimeHelper.formatDateTime(e, COMMON_FORMAT.DATE_TIME)}</p>
        );
      },
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'updatedBy',
      width: 250,
      render: (e: any, record: any, a: any) => {
        return <p>{e}</p>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 180,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 'ACTIVE':
            label = 'Hoạt động';
            className = 'green';
            break;
          case 'INACTIVE':
            label = 'Không hoạt động';
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
    // {
    //   title: 'Nội dung cập nhật',
    //   dataIndex: 'id',
    //   width: 180,
    //   render: (userId: any, record: any) => {
    //     return (
    //       <Text
    //         onClick={() =>
    //           router.push(`/change-log/FeePolicyTemplate/${record.id}`)
    //         }
    //         link
    //         className="beam-break-world"
    //       >
    //         Xem lịch sử
    //       </Text>
    //     );
    //   },
    // },
    {
      title: 'Hành động',
      dataIndex: 'id',
      width: 250,
      render: (userId: any, record: any, index: any) => {
        return (
          <div>
            <div className="flex gap-3 pl-3">
              <IconEdit
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/lucky-box/budget/${record.id}/edit`)
                }
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <ContentWrapper
      pageTitle="Quản lý giải thưởng"
      primaryButtonText="Thêm mới"
      onClickPrimaryButton={() => router.push('/lucky-box/budget/create')}
      allowedRoles={[UserRole.BEAM_ADMIN]}
    >
      <div className="flex flex-col gap-5">
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
