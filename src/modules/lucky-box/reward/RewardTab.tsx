import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const RewardTab = (props: any) => {
  const { activeItem } = props;
  const router = useRouter();
  const baseRoute = '/lucky-box/reward';
  const tabList = [
    { tab: 'Tổng hợp', itemKey: 'overview' },
    // { tab: 'Nhiệm vụ checkin', itemKey: 'mission-checkin' },
    // { tab: 'Đăng ký Ứng lương', itemKey: 'mission-register-salary-advance' },
    // { tab: 'Nhiệm vụ Ứng lương', itemKey: 'mission-salary-advance' },
    // { tab: 'Nhiệm vụ GTBB', itemKey: 'mission-referrer' },
  ];

  const onChangeRoute = (e: any) => {
    switch (e) {
      case 'overview':
        router.push(`${baseRoute}/overview`);
        break;
      // case 'mission-checkin':
      //   router.push(`${baseRoute}/mission-checkin`);
      //   break;
      // case 'mission-salary-advance':
      //   router.push(`${baseRoute}/mission-salary-advance`);
      //   break;
      // case 'mission-referrer':
      //   router.push(`${baseRoute}/mission-referrer`);
      //   break;
      // case 'mission-register-salary-advance':
      //   router.push(`${baseRoute}/mission-register-salary-advance`);
      //   break;
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
