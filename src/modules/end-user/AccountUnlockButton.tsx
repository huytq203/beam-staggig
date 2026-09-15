import { IconUnlockStroked } from '@douyinfe/semi-icons';
import { Button, Notification, Popconfirm, Tooltip } from '@douyinfe/semi-ui';
import { UserSevice } from '@services/users';
import { useState } from 'react';

export type AccountType = 'admin' | 'hr-admin' | 'user';

interface AccountUnlockButtonProps {
  accountType: AccountType;
  username: string;
  onSuccess: () => void;
}

export const AccountUnlockButton = ({
  accountType,
  username,
  onSuccess,
}: AccountUnlockButtonProps) => {
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      const account = await UserSevice.unlockAccount(username, accountType);
      if (!account) {
        throw new Error('Unlock account request failed');
      }
      Notification.success({
        content: `Đã mở khóa tài khoản ${username}`,
        duration: 2,
        theme: 'light',
      });
      onSuccess();
    } catch (_error) {
      Notification.error({
        content: 'Không thể mở khóa tài khoản. Vui lòng thử lại.',
        duration: 3,
        theme: 'light',
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <Tooltip content="Mở khóa tài khoản" position="top">
      <Popconfirm
        title="Mở khóa tài khoản?"
        content={`Tài khoản ${username} sẽ có thể đăng nhập lại.`}
        okText="Mở khóa"
        cancelText="Hủy"
        onConfirm={handleUnlock}
      >
        <Button
          aria-label={`Mở khóa tài khoản ${username}`}
          icon={<IconUnlockStroked />}
          loading={isUnlocking}
          theme="borderless"
          type="tertiary"
        />
      </Popconfirm>
    </Tooltip>
  );
};
