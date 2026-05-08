import { AppPagination, InputWrapper } from '@components/shared';
import { FormActionButton } from '@components/widgets';
import { CardActionTitle } from '@components/widgets/CardActionTitle';
import { IconEdit, IconLock, IconUnlock } from '@douyinfe/semi-icons';
import {
  DatePicker,
  Divider,
  Modal,
  Notification,
  Popconfirm,
  Table,
  Tag,
  TextArea,
  Tooltip,
  Typography,
} from '@douyinfe/semi-ui';
import { StringHelper } from '@helpers/string.helper';
import { CompanyService } from '@services/companies';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { CompanyListFilter } from './CompanyListFilter';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
export const CompanyList = (props: any) => {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState('');
  const { Text } = Typography;

  const {
    rowSelection,
    showFilter = true,
    showActionButton = true,
    pageSize = 10,
    showSelection = false,
    showDelete = false,
    showEdit = false,
    feePolicyId,
  } = props;

  const router = useRouter();
  const [filter, setFilter] = useState({
    name: '',
    page: 1,
    size: 10,
    sort: ['createdAt', 'desc'],
  });

  const [selected, setSelected] = useState([]);
  const { data, isLoading, refetch } = useQuery(
    ['companies', filter],
    () =>
      CompanyService.getAll({
        ...filter,
        feePolicyId: feePolicyId,
      }),
    {
      // enabled: !isLoading,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(CreateProfileSchema),
    defaultValues: {
      reason: '',
      validDateTimeRange: [new Date(), new Date()],
    } as any,
  });
  const onClickHeref = (slug: any) => {
    router.push('/companies/' + slug);
  };
  const columns = [
    {
      title: 'Tên doanh nghiệp',
      dataIndex: 'name',
      width: 250,
      ellipsis: true,
      render: (name: any, record: any, index: any) => (
        <Text onClick={() => onClickHeref(record.id)} link>
          <span className="beam-break-world">{name}</span>
        </Text>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
    },

    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      width: 250,
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxIdentificationNumber',
      width: 250,
      render: (x: any) => <>{x}</>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      width: '250px',
      render: (e: any) => <TextOverflow children={e} />,
    },
    {
      title: 'Tổng hạn mức',
      dataIndex: 'creditLimit',
      width: 250,
      render: (e: any) => (
        <p className="overflow-hidden truncate w-72">
          {StringHelper.formatVND(e)}
        </p>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'enabled',
      render: (x: any) => (
        <Tag size="small" color={x ? 'green' : 'red'}>
          {x ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
      width: 250,
    },
  ];

  const onSubmit = (values: any) => {
    const payload = {
      id: id,
      blockStart: values.blockDateTimeRange[0],
      blockEnd: values.blockDateTimeRange[1],
      reason: values.reason,
    };
    CompanyService.blockCompany(payload)
      .then((response: any) => {
        if (response.code == 200) {
          Notification.success({
            title: 'Thành công',
            content: 'Tạm khoá ứng lương của doanh nghiệp thành công',
            duration: 3,
            theme: 'light',
          });
          refetch();
        } else {
          Notification.error({
            title: 'Thất bại',
            content: 'Tạm khóa ứng lương của doanh nghiệp thất bại',
            duration: 3,
            theme: 'light',
          });
        }
      })
      .catch((e: any) => {});
  };

  const onBlockCompany = (id: any) => {
    setVisible(true);
    setId(id);
  };
  const onUnblockCompany = (id: any) => {
    CompanyService.unBlockCompany({ id: id })
      .then((response: any) => {
        if (response.code == 200) {
          Notification.success({
            title: 'Thành công',
            content: 'Mở khóa ứng lương của doanh nghiệp thành công',
            duration: 3,
            theme: 'light',
          });
          reset();
          refetch();
        } else {
          Notification.error({
            title: 'Thất bại',
            content: 'Mở khóa ứng lương của doanh nghiệp không thành công',
            duration: 3,
            theme: 'light',
          });
          reset();
        }
      })
      .catch((e: any) => {});
  };

  const defaultRowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Design docs', // Column configuration not to be checked
      name: record.name,
    }),
    onSelect: (record: any, selected: any) => {},
    onSelectAll: (selected: any, selectedRows: any) => {},
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelected(selectedRowKeys);
    },
  };

  const onDeleteSelected = () => {};

  const getTableData = () => {
    if (!data?.content) {
      return [];
    }
    return data?.content.map((x: any) => {
      return {
        ...x,
        key: x.id,
      };
    });
  };

  const getTableColumn = () => {
    let currentColumns: any = [...columns];
    if (showEdit || showDelete) {
      currentColumns.push({
        title: 'Hành động',
        dataIndex: 'id',
        width: 110,
        render: (id: any, record: any) => {
          return (
            <>
              <div className="flex gap-3">
                {showEdit && (
                  <IconEdit
                    className="cursor-pointer"
                    onClick={() => router.push(`/companies/${id}/edit`)}
                  />
                )}
                {record.blocked ? (
                  <Popconfirm
                    title="Bạn có chắc chắn muốn mở khóa ứng lương của doanh nghiệp không?"
                    okText="Có"
                    cancelText="Không"
                    onConfirm={() => onUnblockCompany(record.id)}
                  >
                    <IconLock />
                  </Popconfirm>
                ) : (
                  <IconUnlock onClick={() => onBlockCompany(record.id)} />
                )}
              </div>
            </>
          );
        },
      });
    }

    return currentColumns;
  };

  return (
    <div className="flex flex-col gap-4">
      {showActionButton && (
        <>
          <CardActionTitle
            title="Danh sách doanh nghiệp"
            textAdd="Thêm mới doanh nghiệp"
            textDelete="Xoá đã chọn"
            textImport="Nhập từ Excel"
            showImport={false}
            onAdd={() => router.push('/companies/new')}
            onDelete={onDeleteSelected}
            showDelete={false}
          />
          <Divider dashed />
        </>
      )}

      {showFilter && (
        <>
          <CompanyListFilter onFilter={setFilter} displayEmployeeKey={false} />
        </>
      )}

      <AppTable
        key="company"
        size="small"
        loading={isLoading}
        columns={getTableColumn()}
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
        rowSelection={rowSelection ? rowSelection : defaultRowSelection}
      />
      <Modal
        title="Tạm khoá dịch vụ ứng lương"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={[
          <FormActionButton
            onSubmit={() => {
              setVisible(false);
              return onSubmit(getValues());
            }}
            onCancel={() => setVisible(false)}
          />,
        ]}
        closeOnEsc={true}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-4">
            <InputWrapper
              required
              field="blockDateTimeRange"
              label="Thời gian bắt đầu / Thời gian kết thúc"
              component={(props: any) => (
                <DatePicker
                  showClear={false}
                  type="dateRange"
                  format="dd/MM/yyyy"
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
            <InputWrapper
              required
              field="reason"
              label="Lí do tạm khoá"
              component={(props: any) => (
                <TextArea
                  maxLength={200}
                  maxCount={200}
                  showCounter
                  showClear
                  {...props}
                />
              )}
              errors={errors}
              control={control}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
