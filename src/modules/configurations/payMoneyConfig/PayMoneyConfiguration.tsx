import AppTable from '@components/shared/AppTable/AppTable';
import { Radio, RadioGroup, TabPane, Tabs } from '@douyinfe/semi-ui';
import { PayMoneyConfigurationFilter } from './PayMoneyConfigurationFilter';
import { PayMoneyList } from './PayMoneyList';

export const PayMoneyConfiguration = () => {
  return (
    <div className='mt-3'>
       <Tabs type='line'>
      <TabPane tab='Ngân hàng' itemKey='1'>
        <PayMoneyList/>  
      </TabPane>
      <TabPane tab='Ví điện tử' itemKey='2'>
       
      </TabPane>
    </Tabs>
     
    </div>
  );

  
  
 
};
