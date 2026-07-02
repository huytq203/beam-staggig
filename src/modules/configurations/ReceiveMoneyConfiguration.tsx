import { TabPane, Tabs } from '@douyinfe/semi-ui';
import React from 'react';
import { BankMoney } from './receiveMoneyConfig/BankMoney';
1;
const ReceiveMoneyConfiguration = (props: any) => {
  const { setCheckData } = props;
  return (
    <div className="mt-3">
      <Tabs type="button">
        <TabPane tab="Ngân hàng" itemKey="1">
          <BankMoney setCheckData={setCheckData} />
        </TabPane>
        <TabPane tab="Ví điện tử" itemKey="2"></TabPane>
      </Tabs>
    </div>
  );
};

export default ReceiveMoneyConfiguration;
