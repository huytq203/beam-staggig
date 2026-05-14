import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import {
  Button,
  Modal,
  Notification,
  Switch,
  Typography,
} from '@douyinfe/semi-ui';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { IconEdit } from '@douyinfe/semi-icons';
import { useState } from 'react';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { DebtService } from '@services/debt-cash';
import { OuststandingBalanceFilter } from './OuststandingBalanceFilter';
import { ContentWrapper } from '@components/widgets';
import { OuststandingBalanceForm } from './OuststandingBalanceForm';
const OuststandingBalanceList = (props: any) => {
  const { data, loading, onPaginate, filter, refetch } = props;
  const [openModal, setOpenModal] = useState({
    isOpenModal: false,
    id: null,
  });
  const [loadingButton, setLoadingButton] = useState(false);
  const { Text } = Typography;

  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.ACCOUNTANT,
    UserRole.HR_ADMIN,
    UserRole.CUSTOMER_SERVICE,
    UserRole.CONTROLLER,
  ]);
  const onOpenPicker = (id: any) => {
    setOpenModal({
      isOpenModal: true,
      id: id,
    });
  };
  const onClosePicker = () => {
    setOpenModal({
      isOpenModal: false,
      id: null,
    });
  };

  // const onEdit = (values: any) => {
  //   setLoadingButton(true);
  //   const salaryPeriod = values?.salaryPeriod
  //     ? values?.salaryPeriod.split('|')
  //     : '|';

  //   const requestParams = {
  //     ...values,
  //     id: openModal?.id,
  //     expiredDate: DateTimeHelper.formatDateTime(
  //       values.expiredDate,
  //       COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
  //     ),
  //     description: FunctionBase.checkTypeofVal(values.description, 'string')
  //       ? values.description.trim()
  //       : null,
  //     savedDate: DateTimeHelper.formatDateTime(
  //       values.savedDate,
  //       COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
  //     ),
  //     salaryPeriodStart: salaryPeriod[0],
  //     salaryPeriodEnd: salaryPeriod[1],
  //   };
  //   DebtService.editDebt(requestParams).then((response: any) => {
  //     if (response) {
  //       Notification.success({
  //         content: `Chỉnh sửa bút hạch toán thành công!`,
  //         theme: 'light',
  //       });
  //       setOpenModal({
  //         isOpenModal: false,
  //         id: null,
  //       });
  //       filter != null && refetch();
  //     } else {
  //       Notification.error({
  //         content: `Chỉnh sửa bút hạch toán thất bại!`,
  //         theme: 'light',
  //       });
  //     }
  //     setLoadingButton(false);
  //   });
  // };

  const columns = [
    {
      title: 'Doanh nghiệp',
      dataIndex: 'companyName',
      width: 250,
      align: 'right' as 'right',
      render: (name: any, record: any, a: any) => {
        return (
          <div>
            {/* <Text link onClick={() => onOpenPicker(record?.id)}> */}
            <span className="beam-break-world">{name}</span>
            {/* </Text> */}
          </div>
        );
      },
    },
    {
      title: 'Số tiền được phép nợ',
      dataIndex: 'moneyAmountDebit',
      width: 150,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        return <div>{StringHelper.formatVND(e)}</div>;
      },
    },
    {
      title: 'Số ngày được quá hạn',
      dataIndex: 'moneyAmountDebit',
      width: 150,
      align: 'right' as 'right',
    },
    {
      title: 'Khoá DN khi ngày đến hạn kết thúc',
      dataIndex: 'savedDateDebit',
      width: 150,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        return (
          <ProtectedWrapper
            allowedRoles={[
              UserRole.BEAM_ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.CUSTOMER_SERVICE,
              UserRole.SALE,
            ]}
          >
            <Switch
            // checked={e?.includes(companyId)}
            // onChange={() => onClickAction(record, e?.includes(companyId))}
            />
          </ProtectedWrapper>
        );
      },
    },
    {
      title: 'Ngày khởi tạo',
      dataIndex: 'savedDateCredit',
      width: 150,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        return (
          <div>
            {e === null
              ? ''
              : DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE)}
          </div>
        );
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      align: 'right' as 'right',
      render: (e: any) => (
        <p>
          {e === null
            ? ''
            : DateTimeHelper.convertTimeZone(e, COMMON_FORMAT.DATE_TIME)}
        </p>
      ),
      width: 200,
    },
    {
      title: 'Nội dung cập nhật',
      dataIndex: 'id',
      width: 180,
      render: (userId: any, record: any) => {
        return (
          <Text
            // onClick={() => router.push(`/change-log/Campaign/${record.id}`)}
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
      dataIndex: 'username',
      width: 140,
      render: (username: any, record: any) => {
        return (
          <ProtectedWrapper allowedRoles={[UserRole.ACCOUNTANT]}>
            {!record.edited && (
              <div className="flex gap-3 pl-3">
                <IconEdit
                  onClick={() => onOpenPicker(record?.id)}
                  className="cursor-pointer"
                />
              </div>
            )}
          </ProtectedWrapper>
        );
      },
    },
  ];
  return (
    <div>
      <div className="pt-6 px-6">
        <OuststandingBalanceFilter />
      </div>
      <ContentWrapper
        pageTitle="Quản lý dư nợ"
        extra={
          <Button onClick={() => onOpenPicker(null)} theme="solid">
            Thêm mới
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <AppTable
            // loading={loading}
            size="small"
            columns={columns}
            className="beam-break-world"
            dataSource={[]}
            renderPagination={(e: any) => {
              return (
                <div className="py-2 w-full flex justify-end">
                  <AppPagination {...data} onChange={onPaginate} />
                </div>
              );
            }}
          />
          <OuststandingBalanceForm
            setOpenModal={setOpenModal}
            openModal={openModal}
          />
        </div>
      </ContentWrapper>
    </div>
  );
};

export default OuststandingBalanceList;
