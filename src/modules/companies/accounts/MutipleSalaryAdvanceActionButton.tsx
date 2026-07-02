import {
  Button,
  Modal,
  Notification,
  Radio,
  RadioGroup,
} from '@douyinfe/semi-ui';
import { EmployeesServices } from '@services/companies/accounts';
import { useState } from 'react';
import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { useQuery } from 'react-query';
export const MultipleSalaryAdvanceActionButton = (props: any) => {
  const { afterSubmit, currentProfile, companyId } = props;
  const [isEnable, setIsEnable] = useState(0);
  const [isOpenConfrimModal, setIsOpenConfirmModal] = useState(false);
  const [filter, setFilter] = useState({
    searchKey: '',
    page: 1,
    size: 10,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  const { data, isLoading, refetch } = useQuery(
    ['accounts-salary-advance', filter, companyId],
    () => EmployeesServices.getListEmployeesInCompany(filter, companyId),
    {
      enabled: isOpenConfrimModal,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const onDisable = async () => {
    const data = await EmployeesServices.disableSalaryAdvanceMultiple({
      ids: selectedRowKeys,
    });
    onCloseModal();
    afterSubmit && afterSubmit();

    return data;
  };

  const onEnable = async () => {
    const data = await EmployeesServices.enableSalaryAdvanceMultiple({
      ids: selectedRowKeys,
    });
    onCloseModal();
    afterSubmit && afterSubmit();
    return data;
  };
  const onProcessStatus = (isEnable: any) => {
    if (isEnable == 0) {
      return onDisable();
    } else {
      return onEnable();
    }
  };

  const onCloseModal = () => {
    setIsOpenConfirmModal(false);
    setSelectedRowKeys([]);
  };
  const defaultRowSelection = {
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Design docs',
      name: record.name,
    }),
    onSelect: (record: any, selected: any) => {},
    onSelectAll: (selected: any, selectedRows: any) => {},
    // onChange: (selectedRowKeys: any, selectedRows: any) => {},
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };
  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 250,
      align: 'right' as 'right',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'employeeCode',
      width: 200,
      align: 'right' as 'right',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      width: 200,
      align: 'right' as 'right',
      render: (value: any, record: any, a: any) => {
        return <>{value == 1 ? 'Quản lý' : 'Nhân viên'}</>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'enabled',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => <>{e ? 'Hoạt động' : 'Không hoạt động'}</>,
    },
  ];
  const getColumn = () => {
    return columns;
  };
  const getTableData = () => {
    if (!data) return [];

    const result =
      isEnable == 0
        ? data?.content
            .filter((x: any) => x.salaryAdvance == true)
            .map((x: any) => {
              return {
                ...x,
                key: x.id,
              };
            })
        : isEnable == 1
        ? data?.content
            .filter((x: any) => x.salaryAdvance == false)
            .map((x: any) => {
              return {
                ...x,
                key: x.id,
              };
            })
        : [];
    return result;
  };
  return (
    <>
      <Button
        className="float-right"
        onClick={() => setIsOpenConfirmModal(true)}
        theme="solid"
      >
        Chuyển trạng thái ứng lương theo danh sách
      </Button>

      <Modal
        visible={isOpenConfrimModal}
        width={'70%'}
        onCancel={onCloseModal}
        footer={
          <>
            <Button onClick={onCloseModal}>Huỷ bỏ</Button>
            <Button
              disabled={selectedRowKeys.length <= 1}
              theme="solid"
              onClick={async () => {
                const data = await onProcessStatus(isEnable);
                if (data) {
                  Notification.success({
                    content: `Thay đổi trạng thái thành công`,
                    theme: 'light',
                  });
                }
              }}
            >
              Xác nhận
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div>Lựa chọn trạng thái</div>
          <RadioGroup
            name="enable-salary-advance"
            value={isEnable}
            onChange={(e: any) => {
              setIsEnable(e.target.value);
            }}
            defaultValue={0}
          >
            <Radio value={0}>Khoá tạm ứng</Radio>
            <Radio value={1}>Mở tạm ứng</Radio>
          </RadioGroup>
          <div>
            Bạn có chắc chắn muốn chuyển trạng thái tạm ứng lương của những
            người lao động này không?
          </div>
          <AppTable
            size="small"
            loading={isLoading}
            columns={getColumn()}
            dataSource={getTableData()}
            pagination={false}
            scroll={{ x: 100 }}
            rowSelection={defaultRowSelection}
          />
          <div className="py-2 flex justify-start">
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
        </div>
      </Modal>
    </>
  );
};
