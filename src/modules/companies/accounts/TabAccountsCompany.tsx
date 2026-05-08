import { TabPane, Tabs } from '@douyinfe/semi-ui'
import { IconFile, IconGlobe, IconHelpCircle } from '@douyinfe/semi-icons'
import React from 'react'
import ListAccountsCompany from './ListAccountsCompany'
import ListGroupCompany from '../groups/ListGroupCompany'

const TabAccountsCompany = (props: any) => {
    return (
        <Tabs tabPosition="top" type={"card"}>
            <TabPane
                tab={
                    <span>
                        <IconFile />
                        Accounts
                    </span>
                }
                itemKey="1"
            >
                <div className="pt-5"> <ListAccountsCompany /> </div>
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <IconGlobe />
                        Groups
                    </span>
                }
                itemKey="2"
            >
                <div className="pt-5"> <ListGroupCompany /></div>
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <IconHelpCircle />
                        Help
                    </span>
                }
                itemKey="3"
            >
                <div className="pt-5"> Help</div>
            </TabPane>
        </Tabs >
    )
}

export default TabAccountsCompany