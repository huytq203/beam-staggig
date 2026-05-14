import AppTable from '@components/shared/AppTable/AppTable';
import { AppPagination } from '@components/shared';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { TermFormTypeService } from '@services/termform';
import { useRouter } from 'next/router';
import {
  Tag,
  Popconfirm,
  Notification,
  Typography,
} from '@douyinfe/semi-ui';
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import { UserRole } from '@constants/auth.constants';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { TermFormFilter } from './TermFormFilter';

const ListAllTermForm = () => {

  const { Text } = Typography;

  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
    status: 'ALL',
  });


  const { data, isLoading, refetch } = useQuery(
    ['company-type-selection-list', filter],
    () => TermFormTypeService.getAll(filter)
  );


  const router = useRouter();
  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };
  
  const removeTermForm = (id: any) => {
    TermFormTypeService.removeTermForm(id).then((x: any) => {
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

  const onFilter = (values: any) => {
    setFilter(values);
  }
  
 const columns = [
        {
          title: 'Tên biểu mẫu',
          dataIndex: 'name',
          width: 400,        
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          width: 250,
          align: 'left' as 'left',
          render: (x: any) => {
            let label = '';
            let className: any = '';
    
            switch (x) {
              case 'ACTIVE':
                label = 'Phát hành';
                className = 'green';
                break;
              case 'DRAFT':
                label = 'Bản nháp';
                className = 'teal';
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
          title: 'Cấu hình',
          dataIndex: 'isDefault',
          width: 200,      
          render: (isDefault: boolean) => isDefault ? 'Mặc định' : ''  
        },
        {
          title: 'Hành động',
          width: 250,
          dataIndex: 'id',
          align: 'left' as 'left',
          render: (id: any, record: any) => {
            if (record.status === 'DRAFT') {
              return (
                <ProtectedWrapper
                  allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
                >
                  <div className="flex gap-3 pl-3">
                    <IconEdit
                      onClick={() => router.push(`term-form/${id}/edit`)}
                      className="cursor-pointer"
                    />
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa biểu mẫu này không?"
                      okText="Có"
                      cancelText="Không"
                      onConfirm={() => removeTermForm(id)}
                    >
                      <IconDelete
                        className="cursor-pointer"
                        style={{ color: 'var(--semi-color-danger)' }}
                      />
                    </Popconfirm>
                  </div>
                </ProtectedWrapper>
              );
            }
            return (
              <ProtectedWrapper
                allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
              >
                <div className="flex gap-3 pl-3">
                  <IconEdit
                    onClick={() => router.push(`term-form/${id}/edit`)}
                    className="cursor-pointer"
                  />
                </div>
              </ProtectedWrapper>
            );
          },
        },
      
  ];
    return (
      
    <div className="flex flex-col gap-4">
       <TermFormFilter onFilter = {onFilter} />
      <AppTable
        size="small"
        scroll={{ y: 400 }}
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
      />
      </div>
    );
  };
  
  export default ListAllTermForm;
  