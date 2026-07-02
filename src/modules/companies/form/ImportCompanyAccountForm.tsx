import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { COMMON_FORMAT } from '@constants/common-format';
import { useAuth } from '@contexts/authentication';
import { IconBolt, IconDownload } from '@douyinfe/semi-icons';
import {
  Button,
  Divider,
  Modal,
  Notification,
  Radio,
  RadioGroup,
  Tag,
  Typography,
  Upload,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { getResponseMessage } from '@services/api/handlers';
import { CompanyService } from '@services/companies';
import { EmployeesServices } from '@services/companies/accounts';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
interface ImportCompanyAccountFormProps {
  onCancel?: any;
  basePath?: string;
  companyId?: any;
  companyData?: any;
}

export enum errorMessageImport {
  EXISTED_EMPLOYEE_PHONE_NUMBER = 'Số điện thoại đã tồn tại',
  INVALID_PHONE_NUMBER = 'Số điện thoại không hợp lệ',
  EMPTY_SALARY = 'Trường giá trị lương bị trống',
}

const renderErrorMessage = (message: any, key: number) => {
  const errorMessages: any = {
    EXISTED_EMPLOYEE_PHONE_NUMBER_AND_IDENTITY_NUMBER: `SĐT ${message?.errorData?.phoneNumber} và CMT/CCCD/Số hộ chiếu ${message?.errorData?.identityNumber} này đã tồn tại. Vui lòng cập nhật lại thông tin của NLĐ.`,
    EXISTED_EMPLOYEE_PHONE_NUMBER_AND_IDENTITY_NUMBER_IN_OTHER_COMPANY: `SĐT ${message?.errorData?.phoneNumber} và CMT/CCCD/Số hộ chiếu ${message?.errorData?.identityNumber} này đã tồn tại trong công ty khác. Vui lòng kiểm tra lại.`,
    EXISTED_EMPLOYEE_PHONE_NUMBER: `SĐT ${message?.errorData?.phoneNumber} này đã tồn tại. Vui lòng cập nhật lại thông tin của NLĐ.`,
    EXISTED_IDENTITY_NUMBER: `CCCD ${message?.errorData?.identityNumber} này đã tồn tại. Vui lòng cập nhật lại thông tin của NLĐ.`,
  };
  const errorCode = message?.errorCode;
  const errorMsg = errorMessages[errorCode] || getResponseMessage(errorCode);

  return (
    <p key={key}>
      Dòng {message?.rowNumber}
      {message?.employeeName ? `: ${message?.employeeName}` : ''} : {errorMsg}
    </p>
  );
};

const renderAlerts = (alert: any, key: number) => (
  <div key={key}>
    Dòng {alert?.rowNumber}
    {alert?.employeeName ? `: ${alert?.employeeName} : ` : ''}
    {alert?.alerts.map((x: any) => (
      <span key={x.alertCode}>{getResponseMessage(x.alertCode)}. </span>
    ))}
  </div>
);

export const resultRender = (e: any) => {
  const { messages, success, affectedRows } = e;
  return (
    <div className="flex flex-col gap-4 py-4 max-h-96 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <div className="font-bold">Xử lý lỗi({messages.length})</div>
        {messages.map(renderErrorMessage)}
      </div>
      {e.alerts.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="font-bold">
            Cảnh báo từ hệ thống({e.alerts.length})
          </div>
          {e.alerts.map(renderAlerts)}
        </div>
      )}
      <div className="flex flex-col gap-2 ">
        <div className="font-bold">Xử lý thành công({affectedRows})</div>
        {success.map((message: any, key: number) => (
          <div key={key}>
            {key + 1} - {message?.employeeName}
          </div>
        ))}
      </div>
    </div>
  );
};

const ImportCompanyAccountForm = (props: ImportCompanyAccountFormProps) => {
  const { basePath, companyId, onCancel, companyData } = props;
  const uploadRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
    sort: ['uploadedAt,desc'],
  });
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery(
    ['employee-template-list'],
    () => EmployeesServices.getEmployeeAccountTemplate(companyId),
    {
      enabled: companyId !== null && companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const {
    data: dataLog,
    isLoading: isLoadingLog,
    refetch: refetchLog,
  } = useQuery(
    ['employee-template-list', filter, companyId],
    () => EmployeesServices.getLogImportEmployee(companyId, filter),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const { Text } = Typography;
  const { authCheckByRole } = useAuth();
  authCheckByRole(
    [
      UserRole.BEAM_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.HR_ADMIN,
      UserRole.CUSTOMER_SERVICE,
      UserRole.CONTROLLER,
      UserRole.RECONCILER,
    ],
    companyData?.employeeInformationChange
  );
  const [listUploaded, setListUploaded] = useState<any>([]);
  const [updateForNewPeriod, setUpdateForNewPeriod] = useState(0);
  const [hasFile, setHasFile] = useState(false);
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
      title: 'Tên File',
      dataIndex: 'fileOriginalName',
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
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 180,
      render: (x: any) => {
        let label = '';
        let className: any = '';

        switch (x) {
          case 'SUCCESS':
            label = 'Thành công';
            className = 'green';
            break;
          case 'FAIL':
            label = 'Không thành công';
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
      title: 'Người upload',
      dataIndex: 'uploadedBy',
      width: 150,
    },
    {
      title: 'Ngày upload',
      dataIndex: 'uploadedAt',
      width: 180,
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'fileUrl',
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
  if (!companyData?.employeeInformationChange) return <></>;

  const donwloadFileImportEmployeeWorkDay = async (fileUrl: any) => {
    if (typeof window !== 'undefined') {
      window.location.href = fileUrl;
    }
  };

  const getTableData = () => {
    if (isLoadingLog || !dataLog?.content) return [];
    return dataLog?.content.filter((x: any) => {
      return x?.status !== 'FAIL';
    });
  };

  const manulUpload = (e: any) => {
    e.stopPropagation();
    uploadRef.current.upload();
  };

  const onUpload = async (data: any) => {
    setLoading(true);
    return await CompanyService.importEmployeeFromCompanyId(
      data,
      companyId,
      updateForNewPeriod
    ).then((x: any) => {
      if (x?.data?.code == 200) {
        Notification.success({
          content: `Tải lên danh sách người lao động thành công!`,
          theme: 'light',
        });

        setListUploaded([...listUploaded, x?.data]);
        Modal.success({
          title: 'Xử lý tải tệp lên thành công',
          cancelText: '',
          okText: 'Đồng ý',
          cancelButtonProps: { style: { display: 'none' } },
          content: resultRender(x?.data?.data),
          width: '800px',
        });
        refetchLog();
        setLoading(false);
        return x;
      } else if (x?.data?.code == 400 && x?.data?.message == 'FAIL') {
        Notification.error({
          content: `Tải lên danh sách người lao động thất bại!`,
          theme: 'light',
        });

        // setListUploaded([...listUploaded, e]);
        Modal.error({
          title: 'Xử lý tải tệp lên thất bại',
          cancelText: '',
          okText: 'Đồng ý',
          cancelButtonProps: { style: { display: 'none' } },
          okButtonProps: {
            style: { backgroundColor: 'rgba( 32,177,170 , 1)' },
          },
          content: resultRender(x?.data?.data),
          width: '600px',
        });
        refetchLog();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };
  return (
    <div className="flex flex-col gap-4 mt-4">
      <ProtectedWrapper
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.CUSTOMER_SERVICE,
          UserRole.SUPER_ADMIN,
          UserRole.HR_ADMIN,
        ]}
      >
        <div>
          <RadioGroup
            onChange={(e: any) => setUpdateForNewPeriod(e.target.value)}
            value={updateForNewPeriod}
            name="update-for-new-period"
          >
            <Radio value={0}>Cập nhật trong kỳ lương</Radio>
          </RadioGroup>
        </div>
        <div>
          <Button
            icon={<IconDownload />}
            theme="light"
            onClick={() => {
              const URL = `${data?.data}`;
              if (typeof window !== 'undefined') {
                window.location.href = URL;
              }
            }}
          >
            Tải file mẫu
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div>Tải lên danh sách người lao động</div>
          <Upload
            ref={uploadRef}
            limit={1}
            uploadTrigger="custom"
            action={`${basePath}?newPeriod=${
              updateForNewPeriod ? 'true' : 'false'
            }`}
            onFileChange={() => {
              setHasFile(true);
            }}
            dragIcon={<IconBolt />}
            draggable={true}
            customRequest={(options: any) => {
              const data = new FormData();
              data.append('file', options.file.fileInstance);

              onUpload(data)
                .then((res: any) => {
                  options.onSuccess(res.data, options.file);
                })
                .catch((err: Error) => {});
            }}
            accept=".xlsx"
            dragMainText={'Tải tệp lên hoặc thả tệp tại đây'}
            dragSubText="Hỗ trợ excel, xlsx không quá 10MB"
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
        <div className="flex flex-col gap-4 max-h-28 overflow-y-auto">
          {listUploaded.map((x: any, idx: any) => {
            const data = x?.data;
            const { affectedRows, messages, success, totalRows } = data;
            return (
              <div>
                <div className="flex gap-2">
                  <div className="font-bold">#{idx + 1}</div>
                  <div>Tổng số bản ghi: {totalRows}</div>
                  <div>Số bản ghi hiệu lực: {affectedRows}</div>
                </div>
              </div>
            );
          })}
        </div>
        <Divider />

        <div>
          <div className="font-bold">Mô tả</div>
          <p>
            Nếu cập nhật trong kỳ: Chỉ thay đổi thông tin của những người trong
            danh sách. Những người lao động còn lại của doanh nghiệp vẫn được
            giữ nguyên
          </p>
        </div>

        <div>
          <div className="font-bold">Hướng dẫn</div>
          <ul className="list-none">
            <li>1. Tải file mẫu danh sách để nhập thông tin người lao động</li>
            <li>2. Thực hiện điền danh sách người lao động vào file mẫu</li>
            <li>3. Chọn file đã điền danh sách</li>
            <li>4. Nhấn Tải lên để cập nhật danh sách</li>
          </ul>
        </div>
      </ProtectedWrapper>
      <div className="flex flex-col gap-4  overflow-y-auto">
        <div>TRẠNG THÁI TẢI LÊN</div>
        {/* {listUploaded.map((x: any, idx: any) => {
          const data = x?.data;
          const { affectedRows, messages, success, totalRows } = data;
          return (
            <div>
              <div className="flex gap-2">
                <div className="font-bold">#{idx + 1}</div>
                <div>Tổng số bản ghi: {totalRows}</div>
                <div>Số bản ghi hiệu lực: {affectedRows}</div>
              </div>
            </div>
          );
        })} */}
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

export default ImportCompanyAccountForm;
