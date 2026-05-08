import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const BeamAdminTabs = (props: any) => {
  const { activeKey = 'edit-information', beamUsername } = props;
  const router = useRouter();
  const originalRoute = `/end-user/${beamUsername}`;

  const beamAdminTabOptions = [
    { tab: 'Thông tin chung', itemKey: 'edit-information', text: 'Thông tin chung' },
    { tab: 'Đặt mật khẩu', itemKey: 'edit-password', text: 'Đặt mật khẩu' },
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
        tabList={beamAdminTabOptions}
      />
    </BoxWrapper>
  );
};
