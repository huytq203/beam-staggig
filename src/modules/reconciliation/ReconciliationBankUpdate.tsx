import { Modal, Notification } from '@douyinfe/semi-ui';
import { ReconciliationService } from '@services/reconciliation';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import ReconciliationBankFilter from './ReconciliationBankFilter';
import {
  TransactionTicketUpdateList,
  TransactionTicketUpdateModal,
} from './ticket-update';
import { UserRole } from '@constants/auth.constants';
import { useAuth } from '@contexts/authentication';

interface ReconciliationBankUpdateProps {
  bank: string;
}

const ReconciliationBankUpdate = (props: ReconciliationBankUpdateProps) => {
  const { bank } = props;
  const [filter, setFilter] = useState({
    fileSource: bank.toUpperCase(),
    page: 1,
    size: 10,
  });
  const { data, isLoading, isFetching, refetch } = useQuery(
    ['reconciliation-bank-update-list', filter],
    () => ReconciliationService.getAllTicketUpdateList(filter),
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
  const [filterTicketTransaction, setFilterTicketTransaction] =
    useState<any>(0);
  const router = useRouter();
  const [confirmDescription, setConfirmDescription] = useState('');
  const [modalState, setModalState] = useState({
    isOpen: router.query.id !== undefined ? true : false,
    formData: null,
  });
  const getTableData = () => {
    if (isLoading || !data) return [];
    const result =
      filterTicketTransaction == 0
        ? data?.filter((e: any) => e.status === 0)
        : filterTicketTransaction == 1
        ? data?.filter((e: any) => e.status === 1)
        : data?.filter((e: any) => e.status === 2);
    return result;
  };
  const onClickOpenModal = (requestData: any = false) => {
    setModalState({
      isOpen: true,
      formData: requestData,
    });
  };

  const onClickCloseModal = (id: any = false, isFetch = false) => {
    setModalState({
      isOpen: false,
      formData: id,
    });
    router.replace(
      `/reconciliation/${bank.toLowerCase()}/update-transition`,
      undefined,
      {
        shallow: true,
      }
    );
    if (isFetch) {
      refetch();
    }
  };

  const onSaveOrUpdate = (values: any, isNew?: any) => {
    if (!isNew) {
      Modal.warning({
        title: 'Lý do thay đổi ?',
        okText: 'Thực hiện',
        content: 'Xác nhận thực hiện tác vụ',
        cancelText: 'Huỷ',
        onOk: () => {
          ReconciliationService.updateTransactionTicket({
            ...values,
            description: confirmDescription,
          }).then((x: any) => {
            if (x) {
              Notification.success({
                content: `Cập nhật thông tin thành công!`,
                theme: 'light',
              });
            }
            onClickCloseModal(null, true);
            setConfirmDescription('');
          });
        },
      });
    } else {
      ReconciliationService.newTransactionTicket(values).then((x: any) => {
        if (x) {
          Notification.success({
            content: `Thành công cập nhật thông tin!`,
            theme: 'light',
          });
        }
        onClickCloseModal(null, true);
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ReconciliationBankFilter
        title="Cập nhật giao dịch"
        onClickUpdateButton={onClickOpenModal}
        type={3}
        onFilterTransactionTicket={setFilterTicketTransaction}
      />
      <TransactionTicketUpdateList
        data={getTableData()}
        loading={isLoading}
        setFilter={setFilter}
        onClickUpdate={(e: any) => onClickOpenModal(e)}
        filterTicketTransaction={filterTicketTransaction}
      />
      <TransactionTicketUpdateModal
        modalState={modalState}
        onOk={onSaveOrUpdate}
        onCancel={() => onClickCloseModal(null)}
      />
    </div>
  );
};

export default ReconciliationBankUpdate;
