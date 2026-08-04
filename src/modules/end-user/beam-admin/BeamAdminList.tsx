import { AppPagination } from "@components/shared";
import AppTable from "@components/shared/AppTable/AppTable";
import { IconEdit, IconMinus, IconLock } from "@douyinfe/semi-icons";
import { Tag, Tooltip, Typography } from "@douyinfe/semi-ui";
import { StringHelper } from "@helpers/string.helper";
import { UserSevice } from "@services/users";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { BeamAdminFilter } from "./BeamAdminFilter";
import { useAuth } from "@contexts/authentication";
import { UserRole } from "@constants/auth.constants";
import { ProtectedWrapper } from "@components/widgets/Auth";
export const BeamAdminList = (props: any) => {
  const { basePath, onClickViewDetail, showFilter = true } = props;
  const { authCheckByRole, profile } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CONTROLLER,
  ]);
  const [filter, setFilter] = useState({
    searchWord: "",
    page: 1,
    size: 10,
    // enable: true,
  });

  const { data, isLoading, refetch } = useQuery(
    ["beam-admin-list", filter],
    () => UserSevice.getAllBeamAdmin(filter),
    {
      // enabled: !isLoading,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    },
  );

  const { Text } = Typography;

  const router = useRouter();

  const getTableData = () => {
    if (isLoading || !data?.content) return [];
    return data?.content;
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
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
      title: "Tài khoản",
      dataIndex: "username",
      width: 250,
      render: (username: any, record: any, a: any) => {
        return (
          <>
            {profile?.roles[0] === UserRole.BEAM_ADMIN ||
            profile?.roles[0] === UserRole.SUPER_ADMIN ? (
              <Text
                onClick={() => router.push(`${username}/edit-information`)}
                link
              >
                <span className="beam-break-world">{username}</span>
              </Text>
            ) : (
              <Text>
                <span className="beam-break-world">{username}</span>
              </Text>
            )}
            {record.accountLocked ? (
              <Tooltip
                content="Tài khoản đã bị tạm khóa do đăng nhập sai 5 lần."
                position="top"
              >
                <Tag
                  className="ml-2 align-middle"
                  color="orange"
                  prefixIcon={<IconLock size="small" />}
                  size="small"
                  tabIndex={0}
                >
                  Đã khóa
                </Tag>
              </Tooltip>
            ) : null}
          </>
        );
      },
    },
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      width: 250,
      render: (name: any, record: any, a: any) => {
        return (
          <Text>
            <span className="beam-break-world">{name}</span>
          </Text>
        );
      },
    },
    {
      title: "Mã nhân viên",
      dataIndex: "code",
      width: 200,
    },
    {
      title: "Quyền",
      dataIndex: "role",
      width: 200,
      render: (e: any) => {
        let label = "";
        switch (e) {
          case "super_admin":
            label = "Supper Admin";
            break;
          case "beam_admin":
            label = "Beam Admin";
            break;
          case "reconciler":
            label = "Đối soát viên";
            break;
          case "accountant":
            label = "Kế toán viên";
            break;
          case "controller":
            label = "Kiểm soát viên";
            break;
          case "hr_admin":
            label = "HR Admin";
            break;
          case "sale":
            label = "Cán bộ kinh doanh";
            break;
          case "cs":
            label = "Dịch vụ khách hàng";
            break;
        }
        return <span>{label}</span>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 250,
      render: (email: any, record: any, a: any) => {
        return (
          <Text>
            <span className="beam-break-world">{email}</span>
          </Text>
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 180,
    },
    {
      title: "Trạng thái",
      dataIndex: "enabled",
      width: 150,
      render: (x: any) => {
        let label = "";
        let className: any = "";

        switch (x) {
          case true:
            label = "Hoạt động";
            className = "green";
            break;
          case false:
            label = "Không hoạt động";
            className = "grey";
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
      title: "Nội dung cập nhật",
      dataIndex: "id",
      width: 180,
      render: (userId: any, record: any) => {
        return (
          <Text
            onClick={() => router.push(`/change-log/UserEntity/${record.id}`)}
            link
            className="beam-break-world"
          >
            Xem lịch sử
          </Text>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "action",
      width: 150,
      render: (_: any, record: any) => {
        return (
          <ProtectedWrapper
            allowedRoles={[UserRole.BEAM_ADMIN, UserRole.SUPER_ADMIN]}
          >
            <div className="flex gap-3 pl-3">
              <IconEdit
                onClick={() =>
                  router.push(`${record?.username}/edit-information`)
                }
                className="cursor-pointer"
              />
            </div>
          </ProtectedWrapper>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <BeamAdminFilter onFilter={setFilter} refetch={refetch} />
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
