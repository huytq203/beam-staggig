import { IconBolt } from "@douyinfe/semi-icons";
import {
  Button,
  Divider,
  Modal,
  Notification,
  Tag,
  Typography,
  Upload,
} from "@douyinfe/semi-ui";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@contexts/authentication";
import { UserRole } from "@constants/auth.constants";
import { DateTimeHelper } from "@helpers/date-time.helper";
import { COMMON_FORMAT } from "@constants/common-format";
import { StringHelper } from "@helpers/string.helper";
import { ProtectedWrapper } from "@components/widgets/Auth";
import { TicketService } from "@services/ticket-management";
import { useQuery } from "react-query";
import AppTable from "@components/shared/AppTable/AppTable";
import { AppPagination } from "@components/shared";
import { AuthHelper } from "@helpers/auth.helper";

interface ImportTicketFormProps {
  onCancel?: any;
  companyId: string;
  reFetchTicket: Function;
}

const ErrorMap: { [key: string]: string } = {
  EMPTY_TICKET_CODE: " Vui lòng nhập mã yêu cầu.",
  EMPTY_TICKET_ACTION: " Vui lòng nhập hành động.",
  INVALID_TICKET_ACTION: " Hành động không hợp lệ.",
  EMPTY_TICKET_PHONE_NUMBER: " Vui lòng nhập số điện thoại.",
  EMPTY_TICKET_TYPE: " Vui lòng nhập nhóm yêu cầu.",
  INVALID_TICKET_TYPE: " Nhóm yêu cầu không hợp lệ.",
  EMPTY_TICKET_SUBTYPE: " Vui lòng nhập loại yêu cầu.",
  INVALID_TICKET_SUBTYPE: " Loại yêu cầu không hợp lệ.",
  EMPTY_TICKET_STATUS: " Vui lòng nhập trạng thái yêu cầu.",
  INVALID_TICKET_STATUS: " Trạng thái yêu cầu không hợp lệ.",
  PHONE_NUMBER_IS_NOT_MATCH: " Số điện thoại không khớp.",
  TICKET_TYPE_IS_NOT_MATCH: " Nhóm yêu cầu không khớp.",
  TICKET_SUBTYPE_IS_NOT_MATCH: " Loại yêu cầu không khớp.",
  TICKET_PROCESS_FAILED: " Xử lý không thành công.",
  TICKET_IS_PROCESSED: " Yêu cầu này đã được xử lý.",
  SKIP_TO_PROCESS_MANUALLY: " Với loại yêu cầu đăng ký mới, vui lòng duyệt yêu cầu bằng tay.",
  TICKET_NOT_EXIST: " Mã yêu cầu không tồn tại",
  EXISTED_EMPLOYEE_CODE: " Mã nhân viên đã tồn tại trong doanh nghiệp",
};

const getMessage = (messageCode: string) => {
  if (messageCode in ErrorMap) {
    return ErrorMap[messageCode];
  } else {
    return " Xử lý không thành công";
  }
};

export const resultRender = (e: any) => {
  const { alerts, success } = e;
  return (
    <div className="flex flex-col gap-4 py-4 max-h-96 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <div className="font-bold">Cảnh báo ({alerts.length})</div>
        {alerts.map((message: any, key: number) => {
          return (
            <div>
              <p key={key}>
                {key + 1}. Dòng {message?.rowNumber} :{" "}
                {message?.ticketCode ? ` ${message?.ticketCode}` : ""} :
                {getMessage(message?.alertCode)}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 ">
        <div className="font-bold">Xử lý thành công({success?.length})</div>
        {success.map((message: any, key: number) => {
          const result =
            message.type === "ACCEPTED"
              ? `${key + 1}. Dòng ${message.rowNumber}: ${
                  message?.ticketCode ? message?.ticketCode : ""
                }: Phê duyệt thành công`
              : `${key + 1}. Dòng ${message.rowNumber}: ${
                  message?.ticketCode ? message?.ticketCode : ""
                }: Từ chối thành công`;
          return <div key={key}>{result}</div>;
        })}
      </div>
    </div>
  );
};

const ImportTicketForm = (props: ImportTicketFormProps) => {
  const { onCancel, companyId, reFetchTicket } = props;
  const uploadRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
    sort: ["uploadedAt,desc"],
  });
  const { profile } = useAuth();

  const {
    data: dataLog,
    isLoading: isLoadingLog,
    refetch: refetchLog,
  } = useQuery(
    ["ticket-upload-log", filter, companyId],
    () => TicketService.getLogImportTicket(companyId, filter),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const { Text } = Typography;
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.HR_ADMIN,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
  ]);
  const [listUploaded, setListUploaded] = useState<any>([]);
  const [hasFile, setHasFile] = useState(false);
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
      title: "Tên File",
      dataIndex: "fileOriginalName",
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
      title: "Trạng thái",
      dataIndex: "status",
      width: 180,
      render: (x: any) => {
        let label = "";
        let className: any = "";

        switch (x) {
          case "SUCCESS":
            label = "Thành công";
            className = "green";
            break;
          case "FAIL":
            label = "Không thành công";
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
      title: "Người upload",
      dataIndex: "uploadedBy",
      width: 150,
    },
    {
      title: "Ngày upload",
      dataIndex: "uploadedAt",
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "fileUrl",
      width: 150,
      render: (fileUrl: any, record: any) => {
        return (
          <div className="flex gap-3 pl-3">
            <Text
              onClick={() => donwloadFileImportEmployeeWorkDay(fileUrl)}
              link
            >
              <span className="beam-break-world">Tải xuống</span>
            </Text>
          </div>
        );
      },
    },
  ];

  const donwloadFileImportEmployeeWorkDay = async (fileUrl: any) => {
    if (typeof window !== "undefined") {
      window.location.href = fileUrl;
    }
  };

  const getTableData = () => {
    if (isLoadingLog || !dataLog?.content) return [];
    return dataLog?.content.filter((x: any) => {
      return x?.status !== "FAIL";
    });
  };

  const manulUpload = (e: any) => {
    e.stopPropagation();
    uploadRef.current.upload();
  };

  const onUpload = async (file: any) => {
    setLoading(true);
    return await TicketService.importTicket(file, companyId).then((x: any) => {
      if (
        x?.data?.code == 200 ||
        (x?.data?.code == 400 && x?.data?.message == "FAIL")
      ) {
        setLoading(false);
        return x;
      } else {
        setLoading(false);
      }
    });
  };

  const handleUploadError = (e: any) => {
    Notification.error({
      content: `Tải lên danh sách yêu cầu thất bại!`,
      theme: "light",
    });
    Modal.error({
      title: "Xử lý tải tệp lên thất bại",
      cancelText: "",
      okText: "Đồng ý",
      cancelButtonProps: { style: { display: "none" } },
      content: resultRender(e?.data),
      width: "600px",
    });
    refetchLog();
    reFetchTicket();
  };
  const handleUploadSuccess = (e: any) => {
    Notification.success({
      content: `Tải lên danh sách yêu cầu thành công!`,
      theme: "light",
    });

    setListUploaded([...listUploaded, e]);
    Modal.success({
      title: "Xử lý tải tệp lên thành công",
      cancelText: "",
      okText: "Đồng ý",
      cancelButtonProps: { style: { display: "none" } },
      content: resultRender(e?.data),
      width: "800px",
    });
    refetchLog();
    reFetchTicket();
  };
  const handleUpload = (options: any) => {
    const data = new FormData();
    data.append("file", options.file.fileInstance);

    onUpload(data)
      .then((res: any) => {
        options.onSuccess(res.data, options.file);
      })
      .catch((err: Error) => {});
  };

  const getAccess = (allowedRoles: any) => {
    const userRoles = profile?.roles;
    return !AuthHelper.allowRoleCheck(allowedRoles, userRoles);
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <ProtectedWrapper allowedRoles={[UserRole.HR_ADMIN]}>
        <div className="flex flex-col gap-4">
          <div>Tải lên danh sách yêu cầu</div>
          <Upload
            ref={uploadRef}
            limit={1}
            uploadTrigger="custom"
            onFileChange={() => {
              setHasFile(true);
            }}
            dragIcon={<IconBolt />}
            draggable={true}
            onError={handleUploadError}
            onSuccess={handleUploadSuccess}
            customRequest={handleUpload}
            accept=".xlsx"
            dragMainText={"Tải tệp lên hoặc thả tệp tại đây"}
            dragSubText="Hỗ trợ excel, xlsx"
          />
          <div className="flex">
            <div className="mr-5">
              <Button
                loading={loading}
                disabled={!hasFile}
                theme="solid"
                onClick={manulUpload}
              >
                Tải lên
              </Button>
            </div>
            <div>
              <Button onClick={onCancel}>Quay lại</Button>
            </div>
          </div>
        </div>
        <Divider />
        <div>
          <div className="font-bold">Hướng dẫn</div>
          <ul className="list-none">
            <li>1. Xuất dữ liệu các yêu cầu cần xử lý.</li>
            <li>
              2. Thực hiện điền các giá trị Phê duyệt/Từ chối vào cột hành động
              đầu tiên trong file.
            </li>
            <li>3. Lưu file vừa cập nhật.</li>
            <li>4. Nhấn Tải lên để cập nhật danh sách yêu cầu.</li>
          </ul>
          <p>
            <span className="font-bold">Lưu ý:</span> Đối với loại yêu cầu Đăng
            ký mới, vui lòng phê duyệt yêu cầu bằng tay.
          </p>
        </div>
      </ProtectedWrapper>
      <div className="flex flex-col gap-4  overflow-y-auto">
        <div>TRẠNG THÁI TẢI LÊN</div>
        {getAccess([UserRole.HR_ADMIN]) && (
          <div className="flex justify-end">
            <Button
              className="px-5"
              size="small"
              type="secondary"
              onClick={onCancel}
            >
              Trở lại
            </Button>
          </div>
        )}
        <AppTable
          size="small"
          // loading={isLoadingLog}
          columns={columns}
          className="beam-break-world"
          dataSource={getTableData()}
          renderPagination={(e: any) => {
            return (
              <div className="py-2 w-full flex justify-end">
                <AppPagination
                  {...dataLog}
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
      <Divider />
    </div>
  );
};

export default ImportTicketForm;
