import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { COMMON_FORMAT } from '@constants/common-format';
import { IconEdit } from '@douyinfe/semi-icons';
import {
  Divider,
  Modal,
  Notification,
  Switch,
  Table,
  Typography,
} from '@douyinfe/semi-ui';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { EmployeesServices } from '@services/companies/accounts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { FilterAccounts } from './FilterAccounts';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';

const ListAccountsCompany = (props: any) => {
  const {
    basePath,
    companyId,
    currentProfile,
    onClickViewDetail,
    rowSelection,
    hiddenSelection,
    hiddenPayLimit = false,
    disabledAccountPicker,
    setFilterExport,
    companyData,
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const { profile } = useAuth();
  const userRoles = profile?.roles;
  const router = useRouter();
  const { Text } = Typography;
  const [filter, setFilter] = useState({
    salaryAdvance: '',
    searchKey: '',
    enable: '',
    accountStatus: 'ALL',
    timeType: 'ALL',
    startTime: '',
    endTime: '',
    page: 1,
    size: 10,
    sort: ['updatedAt,desc'],
  });
  const { data, isLoading, refetch, isFetching } = useQuery(
    ['accounts', filter, companyId],
    () => EmployeesServices.getListEmployeesInCompany(filter, companyId),
    {
      enabled: companyId !== null && companyId !== undefined,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const calc = (number: any) => {
    return number?.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
  };

  const roundDouble = (value: number) => {
    if (value == null) return '0';

    const getTruncate = (v: any) => Math.trunc(v);
    const getDecimal = (value: any, integerPart: any) => value - integerPart;
    const getOneDecimal = (decimalPart: any) =>
      Math.trunc(Math.round(decimalPart * 10)) % 10;
    const getSecondDecimal = (decimalPart: any) =>
      Math.trunc(Math.round(decimalPart * 100)) % 10;

    const integerPart = getTruncate(value);
    const decimalPart = getDecimal(value, integerPart);
    const secondDecimal = getSecondDecimal(decimalPart);

    if (secondDecimal >= 5 && secondDecimal <= 9) {
      const truncatedNumber =
        ((value + 0.1) * Math.pow(10, 1)) / Math.pow(10, 1);
      const integerPart1 = getTruncate(truncatedNumber);
      const decimalPart1 = getDecimal(truncatedNumber, integerPart1);
      const oneDecimal = getOneDecimal(decimalPart1);
      return (
        oneDecimal == 0 ? Math.floor(truncatedNumber) : truncatedNumber
      ).toString();
    }
    const value2 = Math.floor(value * 10) / 10;
    const oneDecimal = getOneDecimal(decimalPart);

    return (oneDecimal == 0 ? Math.floor(value2) : value2).toString();
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 100,
      fixed: true,
      render: (name: any, record: any, index: any) => {
        return (
          <Text>
            <span>{StringHelper.indexTable(filter.page, index)}</span>
          </Text>
        );
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 250,
      fixed: true,
      align: 'right' as 'right',
      render: (name: any, record: any, a: any) => {
        return (
          <Text
            onClick={() => router.push(`${basePath}/${record.id}/edit`)}
            link
            className="beam-break-world"
          >
            {name}
          </Text>
        );
      },
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
      width: 200,
      align: 'right' as 'right',
      render: (x: any, record: any) => {
        return (
          <TextOverflow>
            <p className="beam-break-world">
              {(record.groups ?? []).map((groupName: any) => (
                <p className="hidden-word">{groupName.name}</p>
              ))}
            </p>
          </TextOverflow>
        );
      },
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
      render: (e: any) => StringHelper.convertPhoneNumber(e),
    },
    {
      title: 'CMT/CCCD/Hộ chiếu',
      dataIndex: 'identityNumber',
      width: 250,
      align: 'right' as 'right',
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'bankName',
      width: 250,
      align: 'right' as 'right',
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
      title: 'Ngày công thực tế',
      dataIndex: 'workDay',
      width: 250,
      align: 'right' as 'right',
      render: (e: any, render: any) => {
        return (
          <p>
            {companyData?.workDayType === 'UPLOAD_WORKDAY' ||
            companyData?.workDayType === 'API_MIGRATION'
              ? calc(roundDouble(e))
              : e}
          </p>
        );
      },
    },
    {
      title: 'Ngày công tiêu chuẩn',
      dataIndex: 'workDayToTal',
      width: 250,
      align: 'right' as 'right',
    },
    {
      title: 'Số tiền lương đã ứng tại Doanh nghiệp',
      dataIndex: 'advancedInCompanyAmount',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => {
        return <p>{StringHelper.formatVND(e, '-')}</p>;
      },
    },
    {
      title: 'Số tiền lương đã ứng tại Flexpay',
      dataIndex: 'salaryAdvanced',
      width: 250,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        return <p>{StringHelper.formatVND(e, '-')}</p>;
      },
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      width: 150,
      align: 'right' as 'right',
      render: (e: any) => (
        <p>
          {StringHelper.checkCorrectType(e) && e !== 0
            ? StringHelper.formatVND(e, '-')
            : '-'}
        </p>
      ),
    },
    {
      title: 'Quy tắc ứng',
      // dataIndex: 'groupPercentage.payLimitSalaryPercentage',
      width: 250,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        if (currentProfile?.payLimitType == 0 || !record?.payLimit) {
          return <p>-</p>;
        } else {
          return <p>{record?.payLimit}%</p>;
        }
      },
    },
    {
      title: 'Hạn mức cố định',
      dataIndex: 'payLimitValue',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e, '-')}</p>,
    },
    {
      title: `Hạn mức tối đa`,
      dataIndex: 'salaryAdvanceTotal',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e, '-')}</p>,
    },
    {
      title:'Hạn mức thực tế của người lao động',
      dataIndex: 'payLimitPerEmployee',
       align: 'right' as 'right',
      width: 250,
      render: (e: any) => <p>{StringHelper.formatVND(e, '-')}</p>,
    },
    {
      title: `Hạn mức tính theo ngày công thực tế`,
      dataIndex: 'payLimitByWorkDay',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => (
        <p>
          {StringHelper.checkCorrectType(e) && e > 0
            ? `${StringHelper.formatVND(e)}`
            : 0}
        </p>
      ),
    },
    {
      title: 'Hạn mức còn lại',
      dataIndex: 'salaryAdvanceRemain',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e, '-')}</p>,
    },
    {
      title: 'Số tiền đề xuất ứng',
      dataIndex: 'pendingAmount',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{`${(StringHelper.formatVND(e), '-')}`}</p>,
    },
    {
      title: 'Giá trị đã ứng mồng 1',
      dataIndex: 'advancedAmount',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => <p>{StringHelper.formatVND(e, '-')}</p>,
    },
    {
      title: `${
        companyData?.workDayType !== 'FIXED_WORKDAY'
          ? 'Kỳ công'
          : 'Kỳ ứng lương'
      }`,
      dataIndex: 'endPeriod',
      width: 250,
      align: 'right' as 'right',
      render: (e: any, render: any) => (
        <>
          {DateTimeHelper.convertTimeZone(
            render.startPeriod,
            COMMON_FORMAT.DATE
          )}{' '}
          -{' '}
          {DateTimeHelper.convertTimeZone(render.endPeriod, COMMON_FORMAT.DATE)}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'enabled',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => (
        <p className="beam-break-world">
          {e ? 'Đang làm việc' : 'Đã nghỉ việc'}
        </p>
      ),
    },
    {
      title: 'Đăng ký ứng lương',
      dataIndex: 'registerSalaryAdvance',
      width: 190,
      align: 'right' as 'right',
      render: (e: any) => (
        <p className="beam-break-world">
          {e ? 'Đã đăng ký ứng lương' : 'Chưa đăng ký ứng lương'}
        </p>
      ),
    },
    {
      title: 'Ngày đăng ký ứng lương',
      dataIndex: 'registerSalaryAdvanceTimes',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => (
        <>
          {/* {e.map((x: any) => {
            return (
              <p>{DateTimeHelper.convertTimeZone(x, COMMON_FORMAT.DATE)}</p>
            );
          })} */}
          <p>
            {e?.length > 0 &&
              DateTimeHelper.convertTimeZone(e[0], COMMON_FORMAT.DATE)}
          </p>
        </>
      ),
    },
    {
      title: 'Đăng ký Flexpay',
      dataIndex: 'registerFlexpay',
      width: 180,
      align: 'right' as 'right',
      render: (e: any) => (
        <p className="beam-break-world">
          {e ? 'Đã đăng ký Flexpay' : 'Chưa đăng ký Flexpay'}
        </p>
      ),
    },
    {
      title: 'Ngày đăng ký Flexpay',
      dataIndex: 'registerFlexpayTime',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}</>
      ),
    },
    {
      title: 'Ứng lương',
      dataIndex: 'salaryAdvance',
      width: 150,
      align: 'right' as 'right',
      render: (e: any, record: any) => (
        <ProtectedWrapper
          allowedRoles={[
            UserRole.BEAM_ADMIN,
            UserRole.SUPER_ADMIN,
            UserRole.HR_ADMIN,
            UserRole.SALE,
            UserRole.CUSTOMER_SERVICE,
            UserRole.RECONCILER,
            UserRole.ACCOUNTANT,
            UserRole.CONTROLLER,
          ]}
        >
          <Switch
            checked={e}
            onChange={() => onClickAction(record)}
            disabled={
              (userRoles[0] !== 'beam_admin' &&
                userRoles[0] !== 'super_admin' &&
                userRoles[0] !== 'hr_admin' &&
                userRoles[0] !== 'cs') ||
              (companyData?.workDayType === 'FIXED_WORKDAY' && !e)
            }
          />
        </ProtectedWrapper>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      width: 180,
      align: 'right' as 'right',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Người cập nhật',
      dataIndex: 'updatedBy',
      width: 180,
      align: 'right' as 'right',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 250,
      align: 'right' as 'right',
      render: (e: any) => (
        <>{DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}</>
      ),
    },
    {
      title: 'Nội dung cập nhật',
      dataIndex: 'id',
      width: 180,
      align: 'right' as 'right',
      render: (userId: any, record: any) => {
        return (
          <Text
            onClick={() => router.push(`/change-log/Employee/${record.id}`)}
            link
            className="beam-break-world"
          >
            Xem lịch sử
          </Text>
        );
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      width: 130,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        return (
          <ProtectedWrapper
            allowedRoles={[
              UserRole.BEAM_ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.HR_ADMIN,
            ]}
          >
            {companyData?.employeeInformationChange && (
              <IconEdit
                onClick={() => router.push(`${basePath}/${record.id}/edit`)}
                className="cursor-pointer"
              />
            )}
          </ProtectedWrapper>
        );
      },
    },
  ]
    .filter((col: any) => {
      if (companyData?.manageSalaryAdvanceRequest == false) {
        return col.dataIndex != 'pendingAmount';
      }
      return col;
    })
    .filter((col: any) => {
      if (companyData?.employeeInformationChange == false) {
        return col.dataIndex != 'action';
      }
      return col;
    })
    .filter((col: any) => {
      if (companyData?.workDayType === 'FIXED_WORKDAY') {
        return (
          col.dataIndex !== 'workDay' &&
          col.dataIndex !== 'workDayToTal' &&
          col.dataIndex !== 'payLimitByWorkDay'
        );
      }
      return col;
    });
  const onClickAction = (record: any) => {
    const onDisable = async (id: any) => {
      const data = await EmployeesServices.disableSalaryAdvance(id);
      return data;
    };

    const onEnable = async (id: any) => {
      const data = await EmployeesServices.enableSalaryAdvance(id);
      return data;
    };

    const onProcessStatus = (record: any) => {
      if (record.salaryAdvance) {
        return onDisable(record.id);
      } else {
        return onEnable(record.id);
      }
    };

    Modal.confirm({
      title: 'Xác nhận hành động',
      cancelText: 'Huỷ',
      okText: 'Thực hiện',
      onOk: async () => {
        const data = await onProcessStatus(record);
        if (data) {
          Notification.success({
            content: `Thay đổi trạng thái thành công`,
            theme: 'light',
          });
          refetch();
        }
      },
      content:
        'Bạn có chắc chắn muốn chuyển trạng thái tạm ứng lương của người lao động này không?',
    });
  };

  const defaultRowSelection = {
    getCheckboxProps: (record: any) => ({
      // disabled: disabledAccountPicker,
      name: record.name,
    }),
    onSelect: (record: any, selected: any) => {},
    onSelectAll: (selected: any, selectedRows: any) => {},
    // onChange: (selectedRowKeys: any, selectedRows: any) => {},
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    hidden: hiddenSelection,
  };
  const getTableData = () => {
    if (!data || !Array.isArray(data?.content)) return [];

    return data?.content.map((x: any) => {
      return {
        ...x,
        key: x.id,
      };
    });
  };

  const getColumn = () => {
    // if (userRoles[0] === 'accountant') {
    //   return columns.filter((x: any) => x.title !== 'Nội dung cập nhật');
    // }
    if (!companyData?.haveAdvancedAmount) {
      return columns.filter((x: any) => x.dataIndex !== 'advancedAmount');
    }
    return columns;
  };
  return (
    <div>
      <div className="flex flex-col gap-4">
        <FilterAccounts
          refetch={refetch}
          onFilter={setFilter}
          currentProfile={currentProfile}
          companyId={companyId}
          hiddenPayLimit={hiddenPayLimit}
          setFilterExport={setFilterExport}
          companyData={companyData}
        />
        <AppTable
          size="small"
          loading={isLoading}
          columns={getColumn()}
          dataSource={getTableData()}
          pagination={false}
          scroll={{ x: 200 }}
          rowSelection={rowSelection ? rowSelection : defaultRowSelection}
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
    </div>
  );
};

export default ListAccountsCompany;
