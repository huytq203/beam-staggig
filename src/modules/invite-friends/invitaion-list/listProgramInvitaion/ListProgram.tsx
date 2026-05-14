import { AppPagination } from "@components/shared";
import AppTable from "@components/shared/AppTable/AppTable";
import { ProtectedWrapper } from "@components/widgets/Auth";
import { UserRole } from "@constants/auth.constants";
import { IconDelete, IconEdit } from "@douyinfe/semi-icons";
import { Notification, Popconfirm, Tag, Typography } from "@douyinfe/semi-ui";
import { StringHelper } from "@helpers/string.helper";
import { CampaignService } from "@services/campaigns";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { ListProgramFilter } from "./ListProgramFilter";
import TextOverflow from "@components/shared/TextOverflow/TextOverflow";

export const ProgramList = (props: any) => {
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
    ["invitation-campaign-list", filter],
    () => CampaignService.getAllInvitationFriend(filter),
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

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      width: 60,
      render: (name: any, record: any, index: any) => (
        <span>{StringHelper.indexTable(filter.page, index)}</span>
      ),
    },
    { title: "Chương trình", dataIndex: "name", width: 120 },
    {
      title: "Tên doanh nghiệp",
      dataIndex: "appliedCompanyNames",
      width: 180,
      render: (e: any) => {
        if (!Array.isArray(e)) return "";
        if (e.includes("ALL")) return "Tất cả";

        const count = e.length;
        const tooltipContent = (
          <div>
            {e.map((name: string, idx: number) => (
              <div key={idx}>- {name}</div>
            ))}
          </div>
        );

        return (
          <TextOverflow contentText={tooltipContent}>
            {`${count} doanh nghiệp`}
          </TextOverflow>
        );
      },
    },
    { title: "Ngân sách", dataIndex: "maximumBudget", width: 120 },
    {
      title: "Ngân sách đã sử dụng",
      dataIndex: "maximumBudgetUsed",
      width: 120,
    },
    { title: "Tổng số mã voucher", dataIndex: "quantity", width: 120 },
    { title: "Tổng số mã voucher đã sử dụng", dataIndex: "used", width: 120 },
    {
      title: "Số tiền tối đa/người",
      dataIndex: "maxRewardPerUser",
      width: 120,
    },
    {
      title: "Giải thưởng Người được giới thiệu Đăng ký CT1",
      dataIndex: "rewardConfigs",
      width: 120,
      render: (arr: any) => {
        const item = arr?.find(
          (i: any) =>
            i.role === "INVITEE" && i.taskType === "REGISTER_NEW_COMPANY"
        );
        return item ? item.rewardAmount : "";
      },
    },
    {
      title: "Giải thưởng Người được giới thiệu Đăng ký CT2",
      dataIndex: "rewardConfigs",
      width: 120,
      render: (arr: any) => {
        const item = arr?.find(
          (i: any) =>
            i.role === "INVITEE" && i.taskType === "REGISTER_SALARY_ADVANCE"
        );
        return item ? item.rewardAmount : "";
      },
    },
    {
      title: "Giải thưởng Người giới thiệu Đăng ký CT1",
      dataIndex: "rewardConfigs",
      width: 120,
      render: (arr: any) => {
        const item = arr?.find(
          (i: any) =>
            i.role === "REFERRER" && i.taskType === "REGISTER_NEW_COMPANY"
        );
        return item ? item.rewardAmount : "";
      },
    },
    {
      title: "Giải thưởng Người giới thiệu Đăng ký CT2",
      dataIndex: "rewardConfigs",
      width: 120,
      render: (arr: any) => {
        const item = arr?.find(
          (i: any) =>
            i.role === "REFERRER" && i.taskType === "REGISTER_SALARY_ADVANCE"
        );
        return item ? item.rewardAmount : "";
      },
    },
    {
      title: "Giải thưởng Người giới thiệu Ứng lương CT2",
      dataIndex: "rewardConfigs",
      width: 120,
      render: (arr: any) => {
        const item = arr?.find(
          (i: any) =>
            i.role === "REFERRER" && i.taskType === "FIRST_SALARY_ADVANCE"
        );
        return item ? item.rewardAmount : "";
      },
    },
    { title: "Thời gian tạo", dataIndex: "createdAt", width: 120 },
    { title: "Thời gian áp dụng", dataIndex: "startTime", width: 120 },
    { title: "Thời gian kết thúc", dataIndex: "endTime", width: 120 },
    { title: "Thời gian cập nhật", dataIndex: "updatedAt", width: 120 },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (x: any) => {
        let label = "";
        let className: any = "";

        switch (x) {
          case 0:
            label = "Hoạt động";
            className = "green";
            break;
          case 1:
            label = "Không hoạt động";
            className = "grey";
            break;
          case 2:
            label = "Bản nháp";
            className = "teal";
            break;
          case 3:
            label = "Hết hạn";
            className = "red";
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
      title: "Thao tác",
      dataIndex: "id",
      width: 120,
      render: (id: any, record: any) => (
        <div className="flex gap-3 pl-3">
          <ProtectedWrapper
            allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
          >
            <IconEdit
              onClick={() => router.push(`${basePath}/${id}/edit`)}
              className="cursor-pointer"
            />
          </ProtectedWrapper>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {showFilter && (
        <ListProgramFilter
          onFilter={setFilter}
          refetch={refetch}
          showType={false}
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
