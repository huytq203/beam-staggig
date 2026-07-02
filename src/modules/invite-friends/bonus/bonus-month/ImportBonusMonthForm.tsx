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
import { FriendInvatationService } from '@services/friend-invitation';
import { ContentWrapper } from '@components/widgets';
interface ImportWorkDayEmployeeFormProps {
  onCancel?: any;
  basePath?: string;
  companyId?: any;
  companyData?: any;
}

const ImportBonusMonthForm = (props: ImportWorkDayEmployeeFormProps) => {
  const { basePath, companyId, onCancel, companyData } = props;
  const uploadRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    page: 1,
    size: 10,
  });
  const { Text } = Typography;
  const router = useRouter();
  const {
    data: dataFileTemplate,
    isLoading,
    refetch,
  } = useQuery(
    ['employee-template-list'],
    () => FriendInvatationService.getImportBonusMonthTemplate(),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CONTROLLER,
  ]);

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
    // {
    //   title: 'Hành động',
    //   dataIndex: 'id',
    //   width: 150,
    //   render: (id: any, record: any) => {
    //     return (
    //       <div className="flex gap-3 pl-3">
    //         <Text onClick={() => donwloadFileImportEmployeeWorkDay(id)} link>
    //           <span className="beam-break-world">Tải xuống</span>
    //         </Text>
    //       </div>
    //     );
    //   },
    // },
  ];
  // const resultRender = (e: any) => {
  //   const { messages, success, affectedRows } = e;

  //   return (
  //     <div className="flex flex-col gap-4 py-4 max-h-96 overflow-y-auto">
  //       <div className="flex flex-col gap-2">
  //         <div className="font-bold">Xử lý lỗi({messages.length})</div>
  //         {messages.map((message: any, key: number) => {
  //           const splitErrorMessage = message?.split(': ');
  //           return (
  //             <div key={key}>
  //               {key + 1} - {splitErrorMessage[0]}
  //               {splitErrorMessage[2] !== undefined
  //                 ? `: ${splitErrorMessage[1]}`
  //                 : ''}
  //               {splitErrorMessage[2] !== undefined
  //                 ? `: ${getResponseMessage(splitErrorMessage[2])}`
  //                 : `: ${getResponseMessage(splitErrorMessage[1])}`}
  //             </div>
  //           );
  //         })}
  //       </div>
  //       <div className="flex flex-col gap-2 ">
  //         <div className="font-bold">Xử lý thành công({affectedRows})</div>
  //         {success.map((message: any, key: number) => (
  //           <div key={key}>
  //             {key + 1} - {message}
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  const manulUpload = (e: any) => {
    e.stopPropagation();
    uploadRef.current.upload();
  };

  const onUpload = async (data: any) => {
    setLoading(true);
    return await FriendInvatationService.importBonusMonth(data).then(
      (x: any) => {
        if (x?.data?.code == 200) {
          setLoading(false);
          // refetchLog();
          return x;
        } else {
          setLoading(false);
        }
      }
    );
  };

  // const getTableData = () => {
  //   if (isLoadingLog || !dataLog?.content) return [];
  //   return dataLog?.content;
  // };

  return (
    <ContentWrapper pageTitle="Tải lên danh sách người đạt thưởng tháng">
      <div className="flex flex-col gap-4 mt-4">
        <div>
          <Button
            icon={<IconDownload />}
            theme="light"
            onClick={() => {
              const URL = `${dataFileTemplate?.data}`;
              if (typeof window !== 'undefined') {
                window.location.href = URL;
              }
            }}
          >
            Tải file mẫu
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div>Tải lên danh sách người đạt thưởng tháng</div>
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
              Notification.success({
                content: `Tải lên danh sách người đạt thưởng tháng thành công!`,
                theme: 'light',
              });

              setListUploaded([...listUploaded, e]);
              router.push('/invite-friends/bonus/bonus-month');
              // Modal.success({
              //   title: 'Xử lý tải tệp lên thành công',
              //   cancelText: '',
              //   okText: 'Đồng ý',
              //   cancelButtonProps: { style: { display: 'none' } },
              //   // content: resultRender(e?.data),
              //   width: '600px',
              // });
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
            maxSize={10240}
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
            <li>
              1. Tải file mẫu danh sách để nhập thông tin người giới thiệu đạt
              tiêu chuẩn nhận thưởng trong tháng
            </li>
            <li>2. Thực hiện điền danh sách người giới thiệu vào file mẫu</li>
            <li>3. Chọn file đã điền danh sách</li>
            <li>4. Nhấn Tải lên để cập nhật danh sách</li>
          </ul>
        </div>
        <Divider />

        {/* <div className="flex flex-col gap-4  overflow-y-auto">
        <div>TRẠNG THÁI TẢI LÊN</div> */}
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
        {/* <AppTable
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
      </div> */}
        {/* <Divider /> */}
      </div>
    </ContentWrapper>
  );
};

export default ImportBonusMonthForm;
