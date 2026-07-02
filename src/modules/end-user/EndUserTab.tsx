import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/authentication';
import { UserRole } from '@constants/auth.constants';
export const EndUserTabs = (props: any) => {
  const { activeKey = 'overview' } = props;
  const router = useRouter();
  const originalRoute = `/end-user`;
  const { profile } = useAuth();
  const endUserTabOptions = [
    {
      tab: 'Quản lý tài khoản Admin',
      itemKey: 'beam-admin',
      text: 'Quản lý tài khoản Admin',
    },
    {
      tab: 'Quản lý tài khoản HR Admin',
      itemKey: 'hr-admin',
      text: 'Quản lý tài khoản HR Admin',
    },
    {
      tab: 'Quản lý tài khoản người dùng',
      itemKey: 'user',
      text: 'Quản lý tài khoản người dùng',
    },
  ].filter((x: any) => {
    if (profile?.roles[0] === UserRole.CUSTOMER_SERVICE) {
      return x.itemKey != 'beam-admin';
    } else if (profile?.roles[0] === UserRole.CONTROLLER) {
      return x.itemKey != 'user';
    }
    return x;
  });

  return (
    <BoxWrapper padding={6}>
      <Tabs
        type="button"
        keepDOM={false}
        activeKey={activeKey}
        onChange={(tabKey: any) => {
          router.push(originalRoute + `/${tabKey}`);
        }}
        contentStyle={{
          display: 'none',
        }}
        tabList={endUserTabOptions}
      />
    </BoxWrapper>
  );
};
