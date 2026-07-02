import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const InvitaionTabs = (props: any) => {
  const { activeItem } = props;
  const router = useRouter();
  const baseRoute = '/invite-friends/invitation-list';
  const tabList = [
    { tab: 'Danh sách giới thiệu', itemKey: 'referrer' },
    { tab: 'Người được giới thiệu', itemKey: 'presentee' },
  ];

  const onChangeRoute = (e: any) => {
    switch (e) {
      case 'referrer':
        router.push(`${baseRoute}/referrer`);
        break;
      case 'presentee':
        router.push(`${baseRoute}/presentee`);
        break;
    }
  };

  return (
    <>
      <BoxWrapper padding={6}>
        <Tabs
          type="button"
          contentStyle={{
            display: 'none',
          }}
          tabList={tabList}
          activeKey={activeItem}
          onChange={onChangeRoute}
        />
      </BoxWrapper>
    </>
  );
};
