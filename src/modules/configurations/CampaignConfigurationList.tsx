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
import { useEffect, useState } from 'react';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
const CampaignConfigurationList = () => {
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
  });
  const { data, isLoading, refetch } = useQuery(
    ['campaign-type-selection-list', filter],
    () => CampaignService.getCampaignTypes(filter)
  );

  const router = useRouter();
  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };

  const onClickAction = (record: any) => {
    const onDisableCampaignType = async (id: any) => {
      const data = await CampaignService.disableCampaignType(id);
      return data;
    };

    const onEnableCampaignType = async (id: any) => {
      const data = await CampaignService.enableCampaignType(id);
      return data;
    };

    const onProcessStatus = (record: any) => {
      if (record.enabled) {
        return onDisableCampaignType(record.id);
      } else {
        return onEnableCampaignType(record.id);
      }
    };

    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Huỷ',
      okText: 'Thực hiện',
      onOk: async () => {
        const data = await onProcessStatus(record);
        if (data) {
          Notification.success({
            content: `Thay đổi trạng thái thành công`,
            theme: 'light',
          });
          refetch();
        }
      },
      content:
        'Bạn có chắc muốn chuyển trạng thái hoạt động của chiến dịch này không?',
    });
  };

  const   removeCampaignType = (id: any) => {
    CampaignService.removeCampaignType(id).then((x: any) => {
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
      title: 'Tên loại chiến dịch',
      dataIndex: 'name',
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
            label = 'Hoạt động';
            className = 'green';
            break;
          case 1:
            label = 'Không hoạt động';
            className = 'grey';
            break;
          case 2:
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
    // {
    //   title: 'Bật/tắt',
    //   dataIndex: 'enabled',
    //   width: 250,
    //   render: (id: any, record: any) => {
    //     return (
    //       <>{record.status == 2 ? '' : <Switch checked={record.enabled} onChange={() => onClickAction(record)} />}</>
    //     );
    //   },
    // },
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
                onClick={() => router.push(`campaign-type/${id}/edit`)}
                className="cursor-pointer"
              />
              {record.status === 2 ? (
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa chiến dịch này không?"
                  okText="Có"
                  cancelText="Không"
                  onConfirm={() => removeCampaignType(id)}
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

export default CampaignConfigurationList;
