import { Table } from '@douyinfe/semi-ui';
import { TableProps } from '@douyinfe/semi-ui/lib/es/table';
import React from 'react';

export interface AppTableProps extends TableProps {}

const AppTable = (props: AppTableProps) => {
  return (
    <div className={'beam-table'}>
      <Table {...props} bordered empty={'Không có kết quả'} />
    </div>
  );
};

export default AppTable;
