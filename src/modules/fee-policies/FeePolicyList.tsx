import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { IconEdit } from '@douyinfe/semi-icons';
import { Modal, Switch, Tag, Tooltip, Typography } from '@douyinfe/semi-ui';
import { FeePolicyService } from '@services/fee-policy';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '@contexts/authentication';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
export const FeePolicyList = () => {
  const { Text } = Typography;
  const { profile }: any = useAuth();
  const baseRoute = `/fee-policies/assign`;

  const router = useRouter();
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['fee-policies-list', filter],
    () => FeePolicyService.getAll(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const onClickHref = (slug: string) => {
    router.push(baseRoute + '/' + slug);
  };

  const onChangeStatus = (feePolicyId: any, value: any) => {
    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Huỷ',
      okText: 'Thực hiện',
      onOk: async () => {
        FeePolicyService.updateStatus(feePolicyId, value).then((x: any) => {
          refetch();
        });
      },
      content:
        'Bạn có chắc muốn chuyển trạng thái hoạt động của chính sách phí này không?',
    });
  };

  const columns = [
    {
      title: 'Tên của chương trình phí',
      dataIndex: 'name',
      width: 250,
      render: (name: any, record: any, index: any) => (
        <Tooltip position="top" content={name}>
          <Text onClick={() => onClickHref(record.id)} link>
            <p className="line-clamp-1">{name}</p>
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Loại chính sách phí',
      dataIndex: 'feeType',
      width: 150,
      render: (e: any) => {
        return <>{e == 0 ? 'Cố định' : 'Theo khoảng'}</>;
      },
    },
    {
      title: 'Tên biểu mẫu chính sách phí',
      dataIndex: 'feePolicyTemplateName',
      width: 250,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 0:
            label = 'Hoạt động';
            className = 'green';
            break;
          case 1:
            label = 'Không hoạt động';
            className = 'grey';
            break;
          case 2:
            label = 'Lưu nháp';
            className = 'teal';
            break;
          case 3:
            label = 'Hết hạn';
            className = 'red';
            break;
        }

        return (
          <Tag size="small" color={className}>
            {label}
          </Tag>
        );
      },
      width: 150,
    },
    {
      title: 'Nội dung cập nhật',
      dataIndex: 'id',
      width: 180,
      align: 'right' as 'right',
      render: (userId: any, record: any) => {
        return (
          <Text
            onClick={() => router.push(`/change-log/FeePolicy/${record.id}`)}
            link
            className="beam-break-world"
          >
            Xem lịch sử
          </Text>
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      width: 150,
      align: 'right' as 'right',
      render: (userId: any, record: any, index: any) => {
        let label = '';
        let className: any = '';
        const x = record.status;

        switch (x) {
          case 2:
            label = 'Lưu nháp';
            className = 'grey';
            break;
          case 0:
            label = 'Hoạt động';
            className = 'green';
            break;
          case 1:
            label = 'Không hoạt động';
            className = 'red';
            break;
          case 3:
            label = 'Hết hạn';
            className = 'red';
            break;
        }

        return (
          <div>
            <ProtectedWrapper
              allowedRoles={[
                UserRole.BEAM_ADMIN,
                UserRole.SUPER_ADMIN,
                UserRole.CUSTOMER_SERVICE,
              ]}
            >
              {profile?.roles[0] !== 'accountant' && (
                <div className="flex items-center">
                  {x !== 3 && (
                    <IconEdit
                      className="cursor-pointer mx-2"
                      onClick={() => onClickHref(`${record.id}/edit`)}
                    />
                  )}
                  {(x == 0 || x == 1) && (
                    <>
                      <Switch
                        checked={x == 0}
                        onChange={(e: any) => {
                          let val = 1;
                          if (e) {
                            val = 0;
                          }
                          onChangeStatus(record.id, val);
                        }}
                      />
                    </>
                  )}
                </div>
              )}
            </ProtectedWrapper>
          </div>
        );
      },
    },
  ];

  // const rowSelection = {
  //   getCheckboxProps: (record: any) => ({
  //     disabled: record.name === 'Design docs', // Column configuration not to be checked
  //     name: record.name,
  //   }),
  //   onSelect: (record: any, selected: any) => {},
  //   onSelectAll: (selected: any, selectedRows: any) => {},
  //   onChange: (selectedRowKeys: any, selectedRows: any) => {},
  // };

  const getTableData = () => {
    if (!data?.content) return [];
    return data?.content;
  };

  return (
    <>
      {/* <ListFilter onFilter={setFilter} /> */}
      {/* <Divider dashed /> */}
      <AppTable
        size="small"
        loading={isLoading}
        columns={columns}
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
        // rowSelection={rowSelection}
      />
    </>
  );
};
