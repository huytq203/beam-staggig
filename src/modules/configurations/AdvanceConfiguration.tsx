import { Tabs, TabPane } from '@douyinfe/semi-ui';
import React from 'react';
import LimitWarning from './advanceConfig/LimitWarning';
import TransitionWarning from './advanceConfig/TransitionWarning';

const AdvanceConfiguration = () => {
  return (
    <div className='mt-3'>
      <Tabs type='line'>
        <TabPane tab='Cảnh báo hạn mức' itemKey='1'>
          <LimitWarning />
        </TabPane>
        <TabPane tab='Cảnh báo giao dịch' itemKey='2'>
          <TransitionWarning />
        </TabPane>
        <TabPane tab='Cài đặt khác' itemKey='3'></TabPane>
      </Tabs>
    </div>
  );
};

export default AdvanceConfiguration;
