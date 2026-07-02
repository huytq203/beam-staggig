import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const BonusTabs = (props: any) => {
  const { activeItem } = props;
  const router = useRouter();
  const baseRoute = '/invite-friends/bonus';
  const tabList = [
    { tab: 'Chi thưởng tháng', itemKey: 'bonus-month' },
    // { tab: 'Chi thưởng voucher', itemKey: 'voucher' },
    { tab: 'Chi thưởng người giới thiệu', itemKey: 'bonus-referrer' },
    { tab: 'Chi thưởng người được giới thiệu', itemKey: 'bonus-presentee' },
  ];

  const onChangeRoute = (e: any) => {
    switch (e) {
      case 'bonus-month':
        router.push(`${baseRoute}/bonus-month`);
        break;
      case 'voucher':
        router.push(`${baseRoute}/voucher`);
        break;
      case 'bonus-referrer':
        router.push(`${baseRoute}/bonus-referrer`);
        break;
      case 'bonus-presentee':
        router.push(`${baseRoute}/bonus-presentee`);
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
