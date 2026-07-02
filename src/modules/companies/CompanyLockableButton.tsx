import { ActionButton } from '@components/shared';
import { ProtectedWrapper } from '@components/widgets/Auth';
import { UserRole } from '@constants/auth.constants';
import { IconLock, IconUnlockStroked } from '@douyinfe/semi-icons';
import { Modal, Popconfirm, Tooltip } from '@douyinfe/semi-ui';

export const CompanyLockableButton = (props: any) => {
  const { companyData, onUnlock, onLock } = props;
  const onClickUnlock = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn mở khóa ứng lương của doanh nghiệp không?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => onUnlock(companyData.id),
    });
  };
  return (
    <>
      {companyData.blocked ? (
        <Popconfirm
          title="Bạn có chắc chắn muốn mở khóa ứng lương của doanh nghiệp không?"
          okText="Có"
          cancelText="Không"
          onConfirm={() => onUnlock(companyData.id)}
        >
          <Tooltip content="Mở khoá">
            <ActionButton onClick={onClickUnlock}>
              <IconLock size="small" />
            </ActionButton>
          </Tooltip>
        </Popconfirm>
      ) : (
        <Tooltip content="Khoá">
          <ActionButton onClick={() => onLock(companyData.id)}>
            <IconUnlockStroked size="small" />
          </ActionButton>
        </Tooltip>
      )}
    </>
  );
};
