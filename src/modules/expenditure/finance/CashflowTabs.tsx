import { BoxWrapper } from '@components/widgets';
import { Tabs } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const CashflowTabs = (props: any) => {
  const { activeKey = 'overview' } = props;
  const router = useRouter();
  const originalRoute = `/expenditure/finance`;

  const cashflowTabOptions = [
    { tab: 'Tổng quan', itemKey: 'overview', text: 'Tổng quan' },
    { tab: 'Dòng tiền', itemKey: 'cashflow-list', text: 'Dòng tiền' },
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
        tabList={cashflowTabOptions}
      />
    </BoxWrapper>
  );
};
