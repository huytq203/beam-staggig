import { COMMON_FORMAT } from '@constants/common-format';
import { NEXT_PUBLIC_API_CORE } from '@constants/endpoints';
import {
  IconBolt,
  IconGridView,
  IconListView,
  IconUpload,
} from '@douyinfe/semi-icons';
import {
  Button,
  Image,
  Notification,
  SplitButtonGroup,
  Toast,
  Upload,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { axiosInstance } from '@services/api';
import { FileManagerService } from '@services/file-manager';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { FileManagerMainView } from './FileManagerMainView';

export interface FileManagerProps {
  onSelect: any;
  url: any;
  urlGet: any;
  fileSize: number;
  fileType: string;
}

export enum VIEW_TYPE {
  GRID,
  LIST,
}
export const FileManager = (props: any) => {
  const {
    onSelect,
    url,
    urlGet,
    fileSize = 1024,
    fileType,
    disabled = false,
  } = props;

  const [viewType, setViewType] = useState(VIEW_TYPE.GRID);

  const [selected, setSelected] = useState<any>(null);

  const { data, isFetching, isLoading, error, isError, refetch } = useQuery(
    [`file-manager-list`],
    () => FileManagerService.getAllFiles(urlGet),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const isImage = (fileType: any) => {
    return fileType?.startsWith('image');
  };

  const isActiveViewTheme = (currViewType: any) => {
    return currViewType == viewType ? 'solid' : 'light';
  };

  const onChangeViewType = (newViewType: VIEW_TYPE) => {
    setViewType(newViewType);
  };

  const onClickItem = (data: any, value: any) => {
    const { id } = data;
    onSelect(data);
    setSelected(data);
  };

  if (isLoading) return <></>;
  return (
    <>
      <div className="bg-gray-100">
        <div className="flex justify-between items-center gap-2 p-2 bg-gray-500">
          <div data-testid={1} className="flex gap-2 items-center">
            <Button type="tertiary" theme="solid" onClick={() => refetch()}>
              Làm mới
            </Button>
            <div>
              <Upload
                action={`${NEXT_PUBLIC_API_CORE}/file-manager/${url}`}
                dragIcon={<IconBolt />}
                draggable={true}
                accept={fileType}
                maxSize={fileSize}
                disabled={disabled}
                customRequest={(options: any) => {
                  const data = new FormData();
                  data.append('file', options.file.fileInstance);
                  axiosInstance
                    .post(options.action, data)
                    .then((res: any) => {
                      options.onSuccess(res.data, options.file);
                    })
                    .catch((err: Error) => {});
                }}
                showUploadList={false}
                onSuccess={(e: any) => {
                  Notification.success({
                    content: `Tải lên thành công!`,
                    theme: 'light',
                  });
                  refetch();
                }}
                onSizeError={(file, fileList) =>
                  Toast.error(
                    `Vui lòng tải lên file có dung lượng <= ${
                      fileSize / 1024
                    } MB`
                  )
                }
              >
                <Button icon={<IconUpload />} theme="solid">
                  Tải lên file
                </Button>
              </Upload>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <SplitButtonGroup>
              <Button
                theme={isActiveViewTheme(VIEW_TYPE.GRID)}
                onClick={() => onChangeViewType(VIEW_TYPE.GRID)}
                size="small"
              >
                <IconGridView size="small" />
              </Button>
              <Button
                theme={isActiveViewTheme(VIEW_TYPE.LIST)}
                onClick={() => onChangeViewType(VIEW_TYPE.LIST)}
                size="small"
                type="primary"
              >
                <IconListView size="small" />
              </Button>
            </SplitButtonGroup>
            {/* <SplitButtonGroup>
              <Button size="small" type="primary">
                <IconInfoCircle />
              </Button>
            </SplitButtonGroup> */}
          </div>
        </div>

        <div className={`grid grid-cols-${selected ? 4 : 3} p-2 gap-2`}>
          <div className="bg-white col-span-3">
            <FileManagerMainView
              data={data}
              onClickItem={onClickItem}
              currentViewType={viewType}
              selected={selected}
            />
          </div>
          {selected && (
            <div className="bg-white p-2">
              <div className="flex flex-col gap-4 p-4 max-h-64 overflow-auto">
                <div className="grid grid-cols-3 gap-4">
                  <span className="font-bold">Tên file:</span>
                  <span className="col-span-2 break-words">
                    {selected?.originalName}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <span className="font-bold">Ngày tạo:</span>
                  <span className="col-span-2">
                    {DateTimeHelper.convertTimeZone(
                      selected?.createdAt,
                      COMMON_FORMAT.DATE_TIME
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <span className="font-bold">Loại file:</span>
                  <span className="col-span-2 break-words">
                    {selected?.fileType}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <span className="font-bold">Tải xuống:</span>
                  <span className="col-span-2">
                    <a href={selected.url} target="_blank" download>
                      Tải xuống
                    </a>
                  </span>
                </div>

                {isImage(selected.fileType) && (
                  <div className="flex flex-col gap-2">
                    <span className="font-bold">Xem trước</span>
                    <Image
                      src={selected?.url}
                      width="100%"
                      height="100%"
                      className="max-h-72"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
