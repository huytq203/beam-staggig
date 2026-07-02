import { Card } from '@douyinfe/semi-ui';
import { ChartService } from '@services/chart';
import React from 'react';
import { useQuery } from 'react-query';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const CashFlowChart = () => {
  const { data, isLoading, refetch } = useQuery(['cash-flow-chart'], () => ChartService.getCashFlowChart(), {
    // enabled: !isLoading,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });

  return (
    <div>
      <Card className='h-full' title='Dòng tiền'>
        <ResponsiveContainer height={300}>
          <ComposedChart
            width={500}
            height={400}
            data={data?.data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke='#f5f5f5' />
            <XAxis dataKey='date' scale='band' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='requestAmount' fill='#8884d8' />
            <Line type='monotone' dataKey='successAmount' stroke='#ff7300' />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
