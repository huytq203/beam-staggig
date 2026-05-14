import { AppPagination } from "@components/shared";
import AppTable from "@components/shared/AppTable/AppTable";
import TextOverflow from "@components/shared/TextOverflow/TextOverflow";
import { ProtectedWrapper } from "@components/widgets/Auth";
import { UserRole } from "@constants/auth.constants";
import { IconDelete, IconEdit } from "@douyinfe/semi-icons";
import { Notification, Popconfirm, Typography } from "@douyinfe/semi-ui";
import { StringHelper } from "@helpers/string.helper";
import { CampaignService } from "@services/campaigns";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { FriendInvitationVoucherListFilter } from "./FriendInvitationVoucherListFilter";

export const FriendInvitationVoucherList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const [filter, setFilter] = useState({
    searchKey: "",
    campaignType: "",
    startTime: "",
    endTime: "",
    status: "",
    page: 1,
    size: 10,
    sort: ["createdAt,desc"],
  });

  const { data, isLoading, refetch } = useQuery(
    ["friend-invitation-voucher-milestone", filter],
    () => CampaignService.getFriendInvitationVoucherMilestone(filter),
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
      if (x?.data?.code == 200 && x?.data?.message == "OK") {
        Notification.success({
          content: "Xóa thành công",
          duration: 2,
          theme: "light",
        });
        refetch();
      } else {
        Notification.error({
          content: "Có lỗi xảy ra. Vui lòng thử lại",
          duration: 2,
          theme: "light",
        });
      }
    });
  };

  // Helpers
  const statusMap: Record<number | string, string> = {
    0: "Chưa sử dụng",
    1: "Đã sử dụng",
    2: "Hết hạn",
    3: "Đã hủy",
  };

  const formatDate = (value: any) =>
    value ? moment(value).format("DD/MM/YYYY") : "";

  const formatMoney = (value: any) =>
    value ? `${Number(value).toLocaleString()} VND` : "";

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 60,
      render: (stt: any, record: any, index: any) => (
        <span>{stt || StringHelper.indexTable(filter.page, index)}</span>
      ),
    },
    {
      title: "Người giới thiệu",
      dataIndex: "customerPhone",
      width: 160,
    },
    {
      title: "Tên người giới thiệu",
      dataIndex: "customerName",
      width: 160,
    },
    {
      title: "Tên doanh nghiệp người giới thiệu",
      dataIndex: "companyName",
      width: 180,
    },
    // {
    //   title: "Log các mốc thưởng đã đạt được",
    //   dataIndex: "milestoneRewardLog",
    //   width: 200,
    //   render: (v: any) => (
    //     <TextOverflow tooltip={v} placement="top">
    //       {v || ""}
    //     </TextOverflow>
    //   ),
    // },
        {
      title: "Tổng thưởng theo chương trình",
      dataIndex: "paidVoucherValue",
      width: 160,
      render: (v: any) => formatMoney(v),
    },
    {
      title: "Tổng giá trị voucher được nhận",
      dataIndex: "totalVoucherValue",
      width: 180,
      render: (v: any) => formatMoney(v),
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "createdAt",
      width: 120,
      render: (v: any) => formatDate(v),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      width: 120,
      render: (v: any) => formatDate(v),
    },
    {
      title: "Ngày chi thưởng gần nhất",
      dataIndex: "paidDate",
      width: 180,
      render: (v: any) => formatDate(v),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {showFilter && (
        <FriendInvitationVoucherListFilter
          onFilter={setFilter}
          refetch={refetch}
          showType={false}
          filter={filter}
        />
      )}

      <AppTable
        size="small"
        loading={isLoading}
        columns={columns}
        className="beam-break-world"
        dataSource={getTableData()}
        scroll={{ x: "scroll" }}
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
