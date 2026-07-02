import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { CardActionTitle } from '@components/widgets';
import { IconEdit, IconDelete } from '@douyinfe/semi-icons';
import {
  Divider,
  Notification,
  Popconfirm,
  Tag,
  Tooltip,
  Typography,
} from '@douyinfe/semi-ui';
import { FeePolicyTemplateService } from '@services/fee-policy-templates';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '@contexts/authentication';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
export const FeePolicyTemplateList = () => {
  const { Text } = Typography;
  const { profile }: any = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
  });

  const { data, isLoading, refetch } = useQuery(
    ['fee-policies-templates-list', filter],
    () => FeePolicyTemplateService.getAll(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  // const onClickHref = (slug: string) => {
  //   router.push('' + slug);
  // };

  const removeTemplateFee = (id: any) => {
    FeePolicyTemplateService.removeTemplateFee(id).then((x: any) => {
      if (x?.data?.code == 200 && x?.data?.message == 'OK') {
        Notification.success({
          content: 'Xóa thành công',
          duration: 2,
          theme: 'light',
        });
        refetch();
      } else {
        Notification.error({
          content: 'Có lỗi xảy ra. Vui lòng thử lại',
          duration: 2,
          theme: 'light',
        });
      }
    });
  };
  const columns = [
    {
      title: 'Tên chính sách phí',
      dataIndex: 'name',
      width: 250,
      render: (name: any, record: any, index: any) => (
        <Text onClick={() => router.push(`templates/${record.id}`)} link>
          <span className="beam-break-world">{name}</span>
        </Text>
      ),
    },
    {
      title: 'Loại chính sách phí',
      dataIndex: 'feeType',
      width: 250,
      render: (e: any) => {
        return <>{e == 0 ? 'Cố định' : 'Theo khoảng'}</>;
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 250,
      render: (e: any) => (
        <Tooltip position="top" content={e}>
          <TextOverflow children={e} />
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 180,
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
            className = 'red';
            break;
          case 2:
            label = 'Bản nháp';
            className = 'grey';
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
      title: 'Nội dung cập nhật',
      dataIndex: 'id',
      width: 180,
      render: (userId: any, record: any) => {
        return (
          <Text
            onClick={() =>
              router.push(`/change-log/FeePolicyTemplate/${record.id}`)
            }
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
      width: 250,
      render: (userId: any, record: any, index: any) => {
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
                <div className="flex gap-3 pl-3">
                  <IconEdit
                    className="cursor-pointer"
                    onClick={() => router.push(`templates/${record.id}/edit`)}
                  />
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa mẫu chính sách phí này không?"
                    // content="Bạn có chắc chắn muốn xóa chiến dịch này không?"
                    okText="Có"
                    cancelText="Không"
                    onConfirm={() => removeTemplateFee(record.id)}
                  >
                    <IconDelete
                      className="cursor-pointer"
                      style={{ color: 'var(--semi-color-danger)' }}
                    />
                  </Popconfirm>
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
      <CardActionTitle
        title=""
        textAdd="Thêm mẫu mới"
        textDelete="Xoá đã chọn"
        showDelete={false}
        onAdd={() => router.push('/fee-policies/templates/create')}
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.CUSTOMER_SERVICE,
        ]}
      />
      <Divider dashed />
      {/* <ListFilter onFilter={setFilter} /> */}
      {/* <Divider dashed /> */}
      <AppTable
        loading={isLoading}
        columns={columns}
        size="small"
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
        rowKey="id"
        // rowSelection={rowSelection}
      />
    </>
  );
};
