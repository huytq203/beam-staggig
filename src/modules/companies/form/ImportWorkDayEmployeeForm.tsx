import { IconBolt, IconDownload } from '@douyinfe/semi-icons';
import {
  Button,
  Divider,
  Modal,
  Notification,
  Upload,
  Typography,
  Tag,
} from '@douyinfe/semi-ui';
import { EmployeesServices } from '@services/companies/accounts';
import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
import { getResponseMessage } from '@services/api/handlers';
import AppTable from '@components/shared/AppTable/AppTable';
import { AppPagination } from '@components/shared';
import { StringHelper } from '@helpers/string.helper';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { ProtectedWrapper } from '@components/widgets/Auth';
interface ImportWorkDayEmployeeFormProps {
  onCancel?: any;
  basePath?: string;
  companyId?: any;
  companyData?: any;
}

const ImportWorkDayEmployeeForm = (props: ImportWorkDayEmployeeFormProps) => {
  const { basePath, companyId, onCancel, companyData } = props;
  const uploadRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
  });
  const { Text } = Typography;
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery(
    ['employee-template-list'],
    () => EmployeesServices.getImportEmployeeWorkdayTemplate(),
    {
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
    () => EmployeesServices.getLogImportEmployeeWorkday(companyId, filter),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  // const {
  //   data: dataFile,
  //   isLoading: isLoadingFile,
  //   refetch: refetchFile,
  // } = useQuery(
  //   ['employee-template-list', id],
  //   () => EmployeesServices.getLogImportEmployeeWorkday(companyId),
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchIntervalInBackground: false,
  //   }
  // );

  const { authCheckByRole } = useAuth();
  authCheckByRole(
    [
      UserRole.BEAM_ADMIN,
      UserRole.SUPER_ADMIN,
      UserRole.HR_ADMIN,
      UserRole.CUSTOMER_SERVICE,
    ],
    companyData?.workDayType === 'UPLOAD_WORKDAY'
  );

  if (companyData?.workDayType !== 'UPLOAD_WORKDAY') return <></>;

  const [listUploaded, setListUploaded] = useState<any>([]);
  //   const [updateForNewPeriod, setUpdateForNewPeriod] = useState(0);
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
          case 'FAILED':
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
      dataIndex: 'id',
      width: 150,
      render: (id: any, record: any) => {
        return (
          <div className="flex gap-3 pl-3">
            <Text onClick={() => donwloadFileImportEmployeeWorkDay(id)} link>
              <span className="beam-break-world">Tải xuống</span>
            </Text>
          </div>
        );
      },
    },
  ];
  const resultRender = (e: any) => {
    const { messages, success, affectedRows } = e;
    return (
      <div className="flex flex-col gap-4 py-4 max-h-96 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <div className="font-bold">Xử lý lỗi({messages.length})</div>
          {messages.map((message: any, key: number) => {
            return (
              <div key={key}>
                Dòng {message?.rowNumber} :{' '}
                {message?.employeeName ? `${message?.employeeName} : ` : ''}
                {getResponseMessage(message?.errorCode)}
              </div>
            );
          })}
        </div>
        {e.alerts.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="font-bold">
              Cảnh báo từ hệ thống({e.alerts.length})
            </div>
            {e.alerts.map((alert: any, key: number) => {
              return (
                <div>
                  <div key={key}>
                    Dòng {alert?.rowNumber} :{' '}
                    {alert?.employeeName ? `${alert?.employeeName} : ` : ''}{' '}
                    {alert?.alerts.map((x: any) => {
                      return <span>{getResponseMessage(x.alertCode)}. </span>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-col gap-2 ">
          <div className="font-bold">Xử lý thành công({affectedRows})</div>
          {success.map((message: any, key: number) => (
            <div key={key}>
              Dòng {message?.rowNumber} - {message?.employeeName}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const manulUpload = (e: any) => {
    e.stopPropagation();
    uploadRef.current.upload();
  };

  const onUpload = async (data: any) => {
    setLoading(true);
    return await EmployeesServices.importEmployeeWorkday(data, companyId).then(
      (x: any) => {
        if (x?.data?.code == 200) {
          setLoading(false);
          refetchLog();
          return x;
        } else {
          setLoading(false);
        }
      }
    );
  };

  const donwloadFileImportEmployeeWorkDay = async (id: any) => {
    return await EmployeesServices.getImportEmployeeWorkdayFile(id).then(
      (x: any) => {
        const URL = `${x?.data?.data}`;
        if (typeof window !== 'undefined') {
          window.location.href = URL;
        }
      }
    );
  };

  const getTableData = () => {
    if (isLoadingLog || !dataLog?.content) return [];
    return dataLog?.content;
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <ProtectedWrapper
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.HR_ADMIN,
        ]}
      >
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
          <div>Tải lên danh sách ngày công thực tế</div>
          <Upload
            ref={uploadRef}
            limit={1}
            uploadTrigger="custom"
            action={`${basePath}`}
            onFileChange={() => {
              setHasFile(true);
            }}
            dragIcon={<IconBolt />}
            draggable={true}
            onSuccess={(e: any) => {
              {
                e?.data?.messages.length > 0
                  ? Notification.error({
                      content: `Tải lên danh sách ngày công thực tế thất bại!`,
                      theme: 'light',
                    })
                  : Notification.success({
                      content: `Tải lên danh sách ngày công thực tế thành công!`,
                      theme: 'light',
                    });
              }

              setListUploaded([...listUploaded, e]);
              {
                e?.data?.messages.length > 0
                  ? Modal.error({
                      title: 'Xử lý tải tệp lên thất bại',
                      cancelText: '',
                      okText: 'Đồng ý',
                      cancelButtonProps: { style: { display: 'none' } },
                      okButtonProps: {
                        style: { backgroundColor: 'rgba( 32,177,170 , 1)' },
                      },
                      content: resultRender(e?.data),
                      width: '600px',
                    })
                  : Modal.success({
                      title: 'Xử lý tải tệp lên thành công',
                      cancelText: '',
                      okText: 'Đồng ý',
                      cancelButtonProps: { style: { display: 'none' } },
                      content: resultRender(e?.data),
                      width: '600px',
                    });
              }
            }}
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
            dragSubText="Hỗ trợ excel, xlsx"
            maxSize={4096}
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
            <li>1. Tải file mẫu ngày công thực tế để nhập thông tin</li>
            <li>2. Thực hiện điền đầy đủ các thông tin yêu cầu vào file mẫu</li>
            <li>3. Chọn file đã điền thông tin</li>
            <li>
              4. Nhấn Tải lên để cập nhật thông tin ngày công của người lao động
            </li>
          </ul>
        </div>
        <Divider />
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
          loading={isLoadingLog}
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

export default ImportWorkDayEmployeeForm;
