import { Tabs, TabPane } from '@douyinfe/semi-ui';
import React from 'react';
import ListAllTermForm from './ListAllTermForm';
import TermsOfContract from './TermsOfContract';

const ConfigurationTermForm = () => {
    return (
      <div className='mt-3'>
         <Tabs type='line'>
        <TabPane tab='Danh sách biểu mẫu' itemKey='1'>
          <ListAllTermForm/>
        </TabPane>
        <TabPane tab='Gán điều khoản' itemKey='2'>
          <TermsOfContract/>
        </TabPane>
      </Tabs>
       
      </div>
    );
  };
  
  export default ConfigurationTermForm;
  