import {
  Button,
  Input,
  Modal,
  Notification,
  Radio,
  RadioGroup,
} from '@douyinfe/semi-ui';
import { EmployeesServices } from '@services/companies/accounts';
import { IconFilter, IconSearch } from '@douyinfe/semi-icons';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { useQuery } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
export const MultipleSalaryAdvanceForm = (props: any) => {
  const { basePath, currentProfile, companyId, onCancel, companyData } = props;
  const [isEnable, setIsEnable] = useState(0);
  const router = useRouter();
  const [filter, setFilter] = useState({
    searchKey: '',
    page: 1,
    size: 10,
    salaryAdvance: true,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  const { data, isLoading, refetch } = useQuery(
    ['accounts-salary-advance', filter, companyId],
    () => EmployeesServices.getListEmployeesInCompany(filter, companyId),
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.HR_ADMIN,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const {
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      salaryAdvance: '',
      searchKey: '',
      page: 1,
      currentPage: 1,
      size: 10,
    },
  });
  const onClickAction = (isEnable: any) => {
    const onDisable = () => {
      const data = EmployeesServices.disableSalaryAdvanceMultiple({
        ids: selectedRowKeys,
      });
      return data;
    };

    const onEnable = () => {
      const data = EmployeesServices.enableSalaryAdvanceMultiple({
        ids: selectedRowKeys,
      });
      return data;
    };
    const onProcessStatus = (isEnable: any) => {
      if (isEnable == 0) {
        return onDisable();
      } else {
        return onEnable();
      }
    };
    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Huỷ',
      okText: 'Thực hiện',
      onOk: async () => {
        const data = await onProcessStatus(isEnable);
        if (data) {
          Notification.success({
            content: `Thay đổi trạng thái ứng lương thành công`,
            theme: 'light',
          });
          router.replace(`/companies/${companyId}/employees`);
        } else {
          Notification.error({
            content: 'Thay đổi trạng thái ứng lương thất bại',
            duration: 3,
            theme: 'light',
          });
        }
      },
      content:
        'Bạn có chắc chắn muốn chuyển trạng thái tạm ứng lương của những người lao động này không?',
    });
  };
  const onSelectChange = (newSelectedRowKeys: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const defaultRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      render: (name: any, record: any, index: any) => {
        return <span>{StringHelper.indexTable(filter.page, index)}</span>;
      },
    },
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
      title: 'Nhóm',
      dataIndex: 'groups',
      width: 250,
      align: 'right' as 'right',
      render: (x: any, record: any) => {
        return (
          <TextOverflow>
            <p className="beam-break-world">
              {record.groups.map((groupName: any) => (
                <p className="hidden-word">{groupName.name}</p>
              ))}
            </p>
          </TextOverflow>
        );
      },
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e, '-')}</p>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 250,
      align: 'right' as 'right',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      width: 200,
      align: 'right' as 'right',
    },

    {
      title: 'Ngân hàng',
      dataIndex: 'bankName',
      width: 250,
      align: 'right' as 'right',
    },
    {
      title: 'Hạn mức cố định',
      dataIndex: 'payLimitValue',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e, '-')}</p>,
    },
    {
      title: 'Quy tắc ứng',
      // dataIndex: 'groupPercentage.payLimitSalaryPercentage',
      width: 250,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        if (currentProfile?.payLimitType == 0) {
          return <p>-</p>;
        } else {
          return <p>{record?.payLimit}%</p>;
        }
      },
    },
    {
      title: 'Ngày được ứng lương của NLĐ',
      dataIndex: 'startApplyDate',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'enabled',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => <>{e ? 'Đang làm việc' : 'Đã nghỉ việc'}</>,
    },
  ];
  const getColumn = () => {
    return columns;
  };
  const onChangeMultipleSalary = (values: any) => {
    setIsEnable(values.target.value);
    if (values.target.value == 0) {
      setFilter({
        ...filter,
        searchKey: '',
        page: 1,
        salaryAdvance: true,
      });
      setValue('searchKey', '');
    } else {
      setFilter({
        ...filter,
        searchKey: '',
        page: 1,
        salaryAdvance: false,
      });
      setValue('searchKey', '');
    }
    setSelectedRowKeys([]);
  };
  const onSubmitValues = (values: any) => {
    setFilter({
      ...values,
      searchKey: values.searchKey.trim(),
      salaryAdvance: !isEnable,
    });
  };
  const getTableData = () => {
    if (!data) return [];
    const result = data?.content.map((x: any) => {
      return {
        ...x,
        key: x.id,
      };
    });
    return result;
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        <div>Lựa chọn trạng thái</div>
        <div className="flex justify-between items-center">
          <RadioGroup
            name="enable-salary-advance"
            // value={isEnable}
            onChange={(e: any) => onChangeMultipleSalary(e)}
            defaultValue={0}
          >
            <Radio value={0}>Khoá tạm ứng</Radio>
            {companyData?.workDayType !== 'FIXED_WORKDAY' && (
              <Radio value={1}>Mở tạm ứng</Radio>
            )}
          </RadioGroup>
          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={selectedRowKeys.length <= 1}
              theme="solid"
              type="primary"
              onClick={async () => onClickAction(isEnable)}
            >
              Chuyển trạng thái
            </Button>
            <Button
              theme="solid"
              onClick={() =>
                router.replace(`/companies/${companyId}/employees`)
              }
            >
              Quay lại
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <form
            onKeyDown={(e) => {
              e.key === 'Enter' && e.preventDefault();
            }}
          >
            <div className="flex items-center gap-4 my-4 ">
              <div className="flex-1 flex items-center ">
                <div className="flex-1 flex gap-4 w-96">
                  <Controller
                    name="searchKey"
                    control={control}
                    render={({ field }) => (
                      <Input
                        prefix={<IconSearch />}
                        showClear
                        autoComplete="off"
                        placeholder="Tên nhân viên/Mã nhân viên/Số điện thoại"
                        size="large"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  icon={<IconFilter />}
                  theme="solid"
                  onClick={() => onSubmitValues(getValues())}
                  type="secondary"
                  className="w-full"
                >
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </form>
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
        <div className="py-2 flex justify-end">
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
    </>
  );
};
