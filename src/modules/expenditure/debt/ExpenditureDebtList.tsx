import { AppPagination } from '@components/shared';
import AppTable from '@components/shared/AppTable/AppTable';
import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { StringHelper } from '@helpers/string.helper';
import { Modal, Notification, Typography } from '@douyinfe/semi-ui';
import TextOverflow from '@components/shared/TextOverflow/TextOverflow';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';
import { DebtForm } from './DebtForm';
import { useState } from 'react';
import { FunctionBase } from '@helpers/fuction-base.helpers';
import { DebtService } from '@services/debt-cash';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
const ExpenditureDebtList = (props: any) => {
  const { data, loading, onPaginate, filter, refetch } = props;
  const [openModal, setOpenModal] = useState({
    isOpenModal: false,
    id: null,
  });
  const [loadingButton, setLoadingButton] = useState(false);
  const { Text } = Typography;

  const router = useRouter();
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.RECONCILER,
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

  const onEdit = (values: any) => {
    setLoadingButton(true);
    const salaryPeriod = values?.salaryPeriod
      ? values?.salaryPeriod.split('|')
      : '|';

    const requestParams = {
      ...values,
      id: openModal?.id,
      expiredDate: DateTimeHelper.formatDateTime(
        values.expiredDate,
        COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
      ),
      description: FunctionBase.checkTypeofVal(values.description, 'string')
        ? values.description.trim()
        : null,
      savedDate: DateTimeHelper.formatDateTime(
        values.savedDate,
        COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
      ),
      salaryPeriodStart: salaryPeriod[0],
      salaryPeriodEnd: salaryPeriod[1],
    };
    DebtService.editDebt(requestParams).then((response: any) => {
      if (response) {
        Notification.success({
          content: `Chỉnh sửa bút hạch toán thành công!`,
          theme: 'light',
        });
        setOpenModal({
          isOpenModal: false,
          id: null,
        });
        filter != null && refetch();
      } else {
        Notification.error({
          content: `Chỉnh sửa bút hạch toán thất bại!`,
          theme: 'light',
        });
      }
      setLoadingButton(false);
    });
  };
  const columns = [
    {
      title: 'Doanh nghiệp',
      dataIndex: 'companyName',
      width: 250,
      align: 'right' as 'right',
      render: (name: any, record: any, a: any) => {
        return (
          <div>
            <Text link onClick={() => onOpenPicker(record?.id)}>
              <span className="beam-break-world">{name}</span>
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Kỳ lương',
      dataIndex: 'salaryPeriod',
      width: 150,
      align: 'right' as 'right',
      render: (e: any) => (
        <div className="flex flex-col">
          <span>
            {DateTimeHelper.formatDateTime(e?.startDate, COMMON_FORMAT.DATE)}
          </span>
          <span>
            {DateTimeHelper.formatDateTime(e?.endDate, COMMON_FORMAT.DATE)}
          </span>
        </div>
      ),
    },
    {
      title: 'Loại công nợ',
      dataIndex: 'type',
      width: 150,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        let label = '';
        switch (e) {
          case 'IN_PERIOD':
            label = 'Công nợ trong kỳ';
            break;
          case 'OVERDUE':
            label = 'Lãi suất quá hạn';
            break;
        }
        return <div>{label}</div>;
      },
    },
    {
      title: 'Số tiền ghi nợ',
      dataIndex: 'moneyAmountDebit',
      width: 150,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        return <div>{e ? StringHelper.formatVND(e) : 0}</div>;
      },
    },
    {
      title: 'Ngày ghi nợ',
      dataIndex: 'savedDateDebit',
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
      title: 'Số tiền ghi có',
      dataIndex: 'moneyAmountCredit',
      width: 150,
      align: 'right' as 'right',
      render: (e: any) => <p>{e ? StringHelper.formatVND(e) : 0}</p>,
    },
    {
      title: 'Ngày ghi có',
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
      title: 'Ngày đến hạn',
      dataIndex: 'expiredDate',
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
      title: 'Ngày bắt đầu tính quá hạn',
      dataIndex: 'startOverdueDate',
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
      title: 'Số ngày quá hạn',
      dataIndex: 'overdueDays',
      width: 150,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        return <div>{e === null ? '' : e}</div>;
      },
    },
    {
      title: 'Lãi suất quá hạn (ngày)',
      dataIndex: 'overdueInterestRate',
      width: 150,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        return <div>{!e ? '' : e + '%'}</div>;
      },
    },
    {
      title: 'Số tiền lãi phạt quá hạn',
      dataIndex: 'overdueInterestAmount',
      width: 150,
      align: 'right' as 'right',
      render: (e: any, record: any) => {
        return <div>{e ? StringHelper.formatVND(e) : ''}</div>;
      },
    },
    {
      title: 'User hạch toán',
      dataIndex: 'updatedBy',
      width: 200,
      align: 'right' as 'right',
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
      title: 'Tài liệu liên quan',
      dataIndex: 'fileUrl',
      width: 250,
      align: 'right' as 'right',
      render: (e: any, record: any) => (
        <Text
          link
          onClick={() => {
            const URL = `${e}`;
            if (typeof window !== 'undefined') {
              window.open(URL, '_blank');
            }
          }}
        >
          {record.fileName}
        </Text>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      width: 250,
      // align: 'right' as 'right',
      render: (text: any) => (
        <TextOverflow className="beam-break-world" line={3}>
          {text}
        </TextOverflow>
      ),
    },
    {
      title: 'Mã hạch toán',
      dataIndex: 'code',
      width: 280,
      align: 'right' as 'right',
    },
    {
      title: 'Nội dung cập nhật',
      dataIndex: 'id',
      width: 180,
      render: (userId: any, record: any) => {
        return (
          <Text
            onClick={() =>
              router.push(`/change-log/AccountingEntry/${record.id}`)
            }
            link
            className="beam-break-world"
          >
            Xem lịch sử
          </Text>
        );
      },
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <AppTable
        // loading={loading}
        size="small"
        columns={columns}
        className="beam-break-world"
        dataSource={data?.content}
        renderPagination={(e: any) => {
          return (
            <div className="py-2 w-full flex justify-end">
              <AppPagination {...data} onChange={onPaginate} />
            </div>
          );
        }}
      />
      <Modal
        visible={openModal.isOpenModal}
        onCancel={onClosePicker}
        title="Bút toán hạch toán"
        footer={['']}
      >
        <DebtForm
          onSubmit={onEdit}
          openModalEdit={openModal}
          onCancel={onClosePicker}
          loading={loadingButton}
          filter={filter}
        />
      </Modal>
    </div>
  );
};

export default ExpenditureDebtList;
