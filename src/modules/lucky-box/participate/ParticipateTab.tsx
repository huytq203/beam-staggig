import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const ParticipateTab = (props: any) => {
  const { activeItem } = props;
  const router = useRouter();
  const baseRoute = '/lucky-box/participate';
  const tabList = [
    { tab: 'Đăng ký tham gia', itemKey: 'overview' },
    { tab: 'Hoàn tất thủ tục', itemKey: 'procedure' },
    { tab: 'Nhiệm vụ checkin', itemKey: 'mission-checkin' },
    { tab: 'Nhiệm vụ Ứng lương', itemKey: 'mission-salary-advance' },
    { tab: 'Nhiệm vụ GTBB', itemKey: 'mission-referrer' },
  ];

  const onChangeRoute = (e: any) => {
    switch (e) {
      case 'overview':
        router.push(`${baseRoute}/overview`);
        break;
      case 'mission-checkin':
        router.push(`${baseRoute}/mission-checkin`);
        break;
      case 'mission-salary-advance':
        router.push(`${baseRoute}/mission-salary-advance`);
        break;
      case 'mission-referrer':
        router.push(`${baseRoute}/mission-referrer`);
        break;
      case 'procedure':
        router.push(`${baseRoute}/procedure`);
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
