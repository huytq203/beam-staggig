import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import { IconBolt } from '@douyinfe/semi-icons';
import {
  Button,
  Divider,
  Modal,
  Notification,
  Upload,
  Typography,
  Tag,
} from '@douyinfe/semi-ui';
import { getResponseMessage } from '@services/api/handlers';
import { LuckyBoxService } from '@services/lucky-box';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { COMMON_FORMAT } from '@constants/common-format';
import { StringHelper } from '@helpers/string.helper';
import { useQuery } from 'react-query';
import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
interface ImportBonusPhoneCardProps {
  onCancel?: any;
  basePath?: string;
}

export enum errorMessageImport {
  EXISTED_EMPLOYEE_PHONE_NUMBER = 'Số điện thoại đã tồn tại',
  INVALID_PHONE_NUMBER = 'Số điện thoại không hợp lệ',
  EMPTY_SALARY = 'Trường giá trị lương bị trống',
}

const renderErrorMessage = (message: any, key: number) => {
  const errorMessages: any = {
    PHONE_NUMBER_IS_NOT_MATCH: 'Vui lòng nhập số điện thoại.',
    REWARD_AMOUNT_IS_NOT_MATCH: 'Vui lòng nhập số tiền thưởng',
    REWARD_CODE_NOT_EXIST: 'Vui lòng nhập mã thưởng',
    EMPTY_REWARD_AT: 'Vui lòng nhập ngày trả thưởng',
    INVALID_REWARD_AT: 'Ngày trả thưởng không hợp lệ',
    EMPTY_REWARD_STATUS: 'Vui lòng nhập trạng thái chi thưởng',
    EMPTY_FT_CODE: 'Vui lòng nhập mã FT',
    EMPTY_REWARD_PHONE_NUMBER: 'Vui lòng nhập số điện thoại',
    EMPTY_REWARD_CODE: 'Vui lòng nhập mã thưởng',
    EMPTY_REWARD_AMOUNT: 'Vui lòng nhập số tiền thưởng',
  };
  const errorCode = message?.errorCode;
  const errorMsg = errorMessages[errorCode] || getResponseMessage(errorCode);

  return (
    <p key={key}>
      Dòng {message?.rowNumber} : {errorMsg}
    </p>
  );
};

export const resultRender = (errors: any) => {
  return (
    <div className="flex flex-col gap-4 py-4 max-h-96 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <div className="font-bold">Xử lý lỗi({errors?.length})</div>
        {errors?.map(renderErrorMessage)}
      </div>
    </div>
  );
};

const ImportPhoneCard = (props: ImportBonusPhoneCardProps) => {
  const uploadRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    type: 'PHONE_CARD',
    page: 1,
    size: 10,
    sort: ['uploadedAt,desc'],
  });
  const router = useRouter();
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.SALE,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
  ]);
  const { Text } = Typography;
  const [listUploaded, setListUploaded] = useState<any>([]);
  const [hasFile, setHasFile] = useState(false);

  const manulUpload = (e: any) => {
    e.stopPropagation();
    uploadRef.current.upload();
  };

  const {
    data: dataLog,
    isLoading: isLoadingLog,
    refetch: refetchLog,
  } = useQuery(
    ['reward-upload-logs', filter],
    () => LuckyBoxService.getAllRewardUploadLogs(filter),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
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
          case 'ERROR':
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
            <Text onClick={() => donwloadFileImportRewardUpload(fileUrl)} link>
              <span className="beam-break-world">Tải xuống</span>
            </Text>
          </div>
        );
      },
    },
  ];

  const donwloadFileImportRewardUpload = async (fileUrl: any) => {
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
  const onUpload = async (data: any) => {
    setLoading(true);
    return await LuckyBoxService.importPhoneCardReward(data).then((x: any) => {
      if (x?.data?.code == 200) {
        Notification.success({
          content: `Tải lên danh sách thành công!`,
          theme: 'light',
        });

        setLoading(false);
        return x;
      } else if (x?.data?.code == 400 && x?.data?.message == 'FAIL') {
        Notification.error({
          content: `Tải lên danh sách thất bại!`,
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
          content: resultRender(x?.data?.data?.errors),
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
      <div className="flex flex-col gap-4">
        <div>Tải lên danh sách chi thưởng thẻ điện thoại</div>
        <Upload
          ref={uploadRef}
          limit={1}
          maxSize={10240}
          uploadTrigger="custom"
          action={`${NEXT_PUBLIC_API_CORE}/lucky-box/rewards/imports/phone-card-reward`}
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
            <Button onClick={() => router.push('/lucky-box/bonus/phone-card')}>
              Quay lại
            </Button>
          </div>
        </div>
      </div>
      <Divider />

      <div>
        <div className="font-bold">Hướng dẫn</div>
        <ul className="list-none">
          <li>1. Xuất danh sách được chi thưởng thẻ điện thoại</li>
          <li>2. Thực hiện điền trạng thái chi thưởng vào file</li>
          <li>3. Chọn file đã điền</li>
          <li>4. Nhấn Tải lên để cập nhật danh sách</li>
        </ul>
      </div>
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
    </div>
  );
};

export default ImportPhoneCard;
