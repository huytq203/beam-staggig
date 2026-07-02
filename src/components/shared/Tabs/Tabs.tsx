import { Tabs } from '@douyinfe/semi-ui'
import { TabBarProps } from '@douyinfe/semi-ui/lib/es/tabs'

export interface TabsProps extends TabBarProps {
  children: any
}

export const AppTabs = (props: any) => {
  return (
    <div className="px-6 py-8 bg-white rounded-lg">
      <Tabs {...props} type="button" />
    </div>
  )
}
