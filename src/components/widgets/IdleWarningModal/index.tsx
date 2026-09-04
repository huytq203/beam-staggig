import { Button, Modal } from '@douyinfe/semi-ui';

interface IdleWarningModalProps {
  visible: boolean;
  remainingMs: number;
  onExtend: () => void;
}

export const IdleWarningModal = ({
  visible,
  remainingMs,
  onExtend,
}: IdleWarningModalProps) => {
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));

  return (
    <Modal
      title="Phiên đăng nhập sắp hết hạn"
      visible={visible}
      centered
      // closable/maskClosable phải tắt: click ra ngoài hay bấm X đều là "tương
      // tác", nhưng ở đây tương tác KHÔNG được ngầm gia hạn phiên. Chỉ nút bên
      // dưới mới gia hạn.
      closable={false}
      maskClosable={false}
      footer={
        <Button theme="solid" type="primary" onClick={onExtend}>
          Tiếp tục làm việc
        </Button>
      }
    >
      <div aria-live="polite">
        Bạn sẽ được tự động đăng xuất sau <b>{seconds}</b> giây do không có thao
        tác nào. Bấm &quot;Tiếp tục làm việc&quot; để giữ phiên đăng nhập.
      </div>
    </Modal>
  );
};
