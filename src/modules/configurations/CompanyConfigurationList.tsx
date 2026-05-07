import { AppPagination } from '@components/shared';
import {
  Divider,
  Modal,
  Notification,
  Popconfirm,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from '@douyinfe/semi-ui';
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { CampaignService } from '@services/campaigns';
import { useState } from 'react';
import { CompanyTypeService } from '@services/companies/companyTypes/company-types.service';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { UserRole } from '@constants/auth.constants';
import { ProtectedWrapper } from '@components/widgets/Auth';

const CompanyConfigurationList = () => {
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
  });
  const { data, isLoading, refetch } = useQuery(
    ['company-type-selection-list', filter],
    () => CompanyTypeService.getAll(filter)
  );

  const router = useRouter();
  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };
  const removeCompanyType = (id: any) => {
    CompanyTypeService.removeCompanyType(id).then((x: any) => {
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
      title: 'Tên loại cấu hình',
      dataIndex: 'name',
      width: 250,
      render: (text: any) => {
        return <p>{text == 0 ? 'Kì trả lương' : 'Loại hình trả lương'}</p>;
      },
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      width: 250,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: 250,
      render: (text: any) => (
        <TextOverflow className="beam-break-world" line={3}>
          {text}
        </TextOverflow>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 250,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 0:
            label = 'Phát hành';
            className = 'green';
            break;
          case 1:
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
      title: 'Hành động',
      dataIndex: 'id',
      width: 250,
      render: (id: any, record: any) => {
        return (
          <ProtectedWrapper
            allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
          >
            <div className="flex gap-3 pl-3">
              <IconEdit
                onClick={() => router.push(`company-type/${id}/edit`)}
                className="cursor-pointer"
              />
              {record.status === 1 ? (
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa cấu hình này không?"
                  okText="Có"
                  cancelText="Không"
                  onConfirm={() => removeCompanyType(id)}
                >
                  <IconDelete
                    className="cursor-pointer"
                    style={{ color: 'var(--semi-color-danger)' }}
                  />
                </Popconfirm>
              ) : (
                ''
              )}
            </div>
          </ProtectedWrapper>
        );
      },
    },
  ];

  return (
    <div className="px-4">
      <AppTable
        size="small"
        loading={isLoading}
        columns={columns}
        className="beam-break-world"
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

export default CompanyConfigurationList;
