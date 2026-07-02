import { BoxWrapper } from '@components/widgets'
import { TabPane, Tabs } from '@douyinfe/semi-ui'
import { useRouter } from 'next/router'
import { CashflowOverview } from './finance'
import CashFlowList from './finance/CashFlowList'

enum PageActionEnum {
  Null,
  CashFlowList,
  Overview,
}

const ExpenditureFinance = () => {
  const router = useRouter()
  const slug = (router.query.slug as string[]) || ['home']
  const originalRoute = `/expenditure`

  const getCurrentSlug = (): PageActionEnum => {
    switch (slug[0]) {
      case 'home':
        return PageActionEnum.Overview
      case 'cash-flow':
        return PageActionEnum.CashFlowList
      default:
        return PageActionEnum.Overview
    }
  }
  const currentPageAction = getCurrentSlug()
  const tabActivation = [
    {
      key: 'cash-flow',
      includes: [PageActionEnum.CashFlowList],
      defaultUrl: '/finance/cash-flow',
    },
    {
      key: 'overview',
      includes: [PageActionEnum.Overview],
      defaultUrl: '/finance/overview',
    },
  ]

  const getActiveTab = () => {
    const activeTab =
      tabActivation.find((x: any) =>
        x.includes.some((e: any) => e == currentPageAction),
      ) ?? tabActivation[0]
    return activeTab
  }

  const currentActiveTab = getActiveTab()
  const getTabItem = (key: any) => {
    const tab = tabActivation.find((x: any) => x.key == key) ?? tabActivation[0]
    return tab
  }
  return (
    <>
      <BoxWrapper>
        <Tabs
          type="line"
          keepDOM={false}
          activeKey={currentActiveTab.key}
          onChange={(tabKey: any) => {
            const tabData = getTabItem(tabKey)
            router.push(originalRoute + tabData.defaultUrl)
          }}
          contentStyle={{
            width: '100%',
            overflow: 'auto',
          }}
        >
          <TabPane tab="Tổng quan" itemKey="overview">
            <div className="mt-4">
              {currentPageAction == PageActionEnum.Overview && (
                <CashflowOverview />
              )}
            </div>
          </TabPane>
          <TabPane tab="Dòng tiền" itemKey="cash-flow">
            <div className="mt-4">
              {currentPageAction == PageActionEnum.CashFlowList && (
                <CashFlowList />
              )}
            </div>
          </TabPane>
        </Tabs>
      </BoxWrapper>
    </>
  )
}

export default ExpenditureFinance
