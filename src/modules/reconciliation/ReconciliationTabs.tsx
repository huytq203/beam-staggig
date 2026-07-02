import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const ReconciliationTabs = (props: any) => {
  const { activeItem, bank } = props;
  const router = useRouter();
  const baseRoute = `/reconciliation/${bank}`;
  const tabList = [
    { tab: 'Đối soát', itemKey: 'home' },
    { tab: 'Đối soát chốt', itemKey: 'month-end' },
  ];
  const onChangeRoute = (e: any) => {
    if (e == 'home') {
      router.push(baseRoute);
    } else {
      router.push(`${baseRoute}/month-end`);
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
