import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const UserTabs = (props: any) => {
  const { activeKey = 'edit-information-user', beamUsername } = props;
  const router = useRouter();
  const originalRoute = `/end-user/${beamUsername}`;

  const userTabOptions = [
    {
      tab: 'Thông tin chung',
      itemKey: 'edit-information-user',
      text: 'Thông tin chung',
    },
    // {
    //   tab: 'Đặt mật khẩu',
    //   itemKey: 'edit-password-user',
    //   text: 'Đặt mật khẩu',
    // },
  ];
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
        tabList={userTabOptions}
      />
    </BoxWrapper>
  );
};
