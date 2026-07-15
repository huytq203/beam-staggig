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

// The list rows come from /campaigns/all, but whether a campaign is currently
// enabled is authoritative only via the old /campaigns endpoint. So a row's
// active/inactive state is derived by cross-referencing the two APIs (see
// `isEnabled`): present in the enabled set -> "Hoạt động", absent -> "Không
// hoạt động". DRAFT and EXPIRED keep their own labels regardless of `isEnabled`.
// `status` may be a string (DRAFT/EXPIRED from /campaigns/all) or a legacy
// numeric code (2/3), so both are matched.
const isExpiredCampaign = (status: any) =>
  status === 3 || status === 'EXPIRED';
const isDraftCampaign = (status: any) => status === 2 || status === 'DRAFT';

const getCampaignStatusTag = (status: any, isEnabled: boolean) => {
  if (isDraftCampaign(status)) return { label: 'Bản nháp', color: 'teal' };
  if (isExpiredCampaign(status)) return { label: 'Hết hạn', color: 'red' };
  return isEnabled
    ? { label: 'Hoạt động', color: 'green' }
    : { label: 'Không hoạt động', color: 'grey' };
};

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

  // Old /campaigns endpoint only returns currently ENABLED campaigns.
  // We fetch them once to know which rows from /campaigns/all are still enabled.
  const { data: enabledData } = useQuery(
    ['campaign-enabled'],
    () => CampaignService.getEnabled({ page: 1, size: 1000 }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const enabledIds = new Set(
    (enabledData?.content ?? []).map((item: any) => item.id)
  );

  const { Text } = Typography;

  const router = useRouter();

  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    // Annotate each campaign with whether it is still enabled.
    return data?.content.map((item: any) => ({
      ...item,
      isEnabled: enabledIds.has(item.id),
    }));
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
        // Disabled campaigns (not in the enabled set) are struck-through,
        // greyed out and not clickable.
        if (!record.isEnabled) {
          return (
            <Text
              type="tertiary"
              className="beam-break-world font-bold"
              style={{
                color: 'var(--semi-color-disabled-text)',
                cursor: 'default',
              }}
            >
              {name}
            </Text>
          );
        }
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
      render: (x: any, record: any) => {
        const status = getCampaignStatusTag(x, record?.isEnabled);
        return (
          <Tag size="small" color={status.color as any}>
            {status.label}
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
              {!isExpiredCampaign(record.status) && (
                <IconEdit
                  onClick={() => router.push(`${basePath}/${id}/edit`)}
                  className="cursor-pointer"
                />
              )}
              {isDraftCampaign(record.status) ? (
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
