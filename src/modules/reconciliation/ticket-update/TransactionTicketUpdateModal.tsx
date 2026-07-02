import { Modal } from '@douyinfe/semi-ui';
import { TransactionTicketUpdateForm } from './TransactionTicketUpdateForm';
import { useRouter } from 'next/router';
export interface TransactionTicketUpdateModalProps {
  modalState?: any;
  onOk?: any;
  onCancel?: any;
}

export const TransactionTicketUpdateModal = (props: TransactionTicketUpdateModalProps) => {
  const { modalState, onOk, onCancel } = props;
  const router = useRouter();
  return (
    <>
      <Modal
        title='Cập nhật giao dịch tại BEAM'
        visible={modalState?.isOpen}
        onCancel={onCancel}
        width={700}
        footer={[]}
      >
        <TransactionTicketUpdateForm
          isNew={modalState?.formData?.id == null}
          data={modalState?.formData}
          onSubmit={onOk}
          id={router.query.id}
          onCancel={onCancel}
        />
      </Modal>
    </>
  );
};
