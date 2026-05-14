import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconDelete, IconEdit } from '@douyinfe/semi-icons';
import {
  Notification,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  Typography,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { CampaignService } from '@services/campaigns/campaign.service';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { CampaignListFilter } from './CampaignListFilter';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import axios from 'axios';
import { NEXT_PUBLIC_API_MAINTENANCE } from '@constants/endpoints';

export const CampaignList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    searchKey: '',
    campaignType: '',
    startTime: '',
    endTime: '',
    status: '',
    page: 1,
    size: 10,
    sort: ['createdAt,desc'],
  });

  const { data, isLoading, refetch } = useQuery(
    ['campaign-list', filter],
    () => CampaignService.getAll(filter),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const { Text } = Typography;

  const router = useRouter();

  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };

  
  const removeCampaign = (id: any) => {
    CampaignService.removeCampaign(id).then((x: any) => {
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
      title: 'Tên chiến dịch',
      dataIndex: 'name',
      width: 250,
      render: (name: any, record: any, a: any) => {
        return (
          <Text onClick={() => onClickViewDetail(record)} link>
            <span className="beam-break-world">{name}</span>
          </Text>
        );
      },
    },
    {
      title: 'Loại chiến dịch',
      dataIndex: 'campaignType.name',
      width: 250,
    },
    {
      title: 'Mã chiến dịch',
      dataIndex: 'code',
      width: 250,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Ngân sách chiến dịch',
      dataIndex: 'maximumBudget',
      width: 180,
      render: (e: any) => <>{StringHelper.formatVND(e)}</>,
    },
    {
      title: 'Ngân sách đã dùng',
      dataIndex: 'maximumBudgetUsed',
      width: 180,
      render: (e: any) => <>{StringHelper.formatVND(e)}</>,
    },
    {
      title: 'Ngân sách còn lại',
      dataIndex: 'maximumBudgetLeft',
      width: 180,
      render: (e: any, record: any) => (
        <>{record?.maximumBudget && StringHelper.formatVNDWithZeroNumber(e)}</>
      ),
    },

    {
      title: 'Số lượng mã',
      dataIndex: 'quantity',
      width: 150,
    },
    {
      title: 'Số mã đã dùng',
      dataIndex: 'used',
      width: 160,
    },
    {
      title: 'Số mã còn lại',
      dataIndex: 'remain',
      width: 160,
      render: (text: any, record: any) => {
        const remain = record.quantity - record.used;
        return <p>{remain}</p>;
      },
    },
    {
      title: 'Nội dung',
      dataIndex: 'description',
      width: 250,
      render: (e: any) => <TextOverflow children={e} />,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
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
    },
    {
      title: 'Nội dung cập nhật',
      dataIndex: 'id',
      width: 180,
      render: (userId: any, record: any) => {
        return (
          <Text
            onClick={() => router.push(`/change-log/Campaign/${record.id}`)}
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
      render: (id: any, record: any) => {
        return (
          <div className="flex gap-3 pl-3">
            <ProtectedWrapper
              allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
            >
              {record.status !== 3 && (
                <IconEdit
                  onClick={() => router.push(`${basePath}/${id}/edit`)}
                  className="cursor-pointer"
                />
              )}
              {record.status === 2 ? (
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa chiến dịch này không?"
                  // content="Bạn có chắc chắn muốn xóa chiến dịch này không?"
                  okText="Có"
                  cancelText="Không"
                  onConfirm={() => removeCampaign(id)}
                >
                  <IconDelete
                    className="cursor-pointer"
                    style={{ color: 'var(--semi-color-danger)' }}
                  />
                </Popconfirm>
              ) : (
                ''
              )}
            </ProtectedWrapper>
          </div>
        );
      },
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      {showFilter && (
        <CampaignListFilter onFilter={setFilter} refetch={refetch} />
      )}

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
  );
};
