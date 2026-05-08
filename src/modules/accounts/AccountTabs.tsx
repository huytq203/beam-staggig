import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const AccountTabs = (props: any) => {
  const { activeKey = 'edit-information' } = props;
  const router = useRouter();
  const originalRoute = `/accounts`;

  const accountTabOptions = [
    { tab: 'Thông tin chung', itemKey: 'edit-information', text: 'Thông tin chung' },
    { tab: 'Đổi mật khẩu', itemKey: 'edit-password', text: 'Đổi mật khẩu' },
  ];

  return (
    <BoxWrapper padding={6}>
      <Tabs
        type='button'
        keepDOM={false}
        activeKey={activeKey}
        onChange={(tabKey: any) => {
          router.push(originalRoute + `/${tabKey}`);
        }}
        contentStyle={{
          display: 'none',
        }}
        tabList={accountTabOptions}
      />
    </BoxWrapper>
  );
};
