import { Card } from '@douyinfe/semi-ui';
import { ChartService } from '@services/chart';
import { useQuery } from 'react-query';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export const PayLimitChart = () => {
  const { data, isLoading, refetch } = useQuery(['pay-limit-chart'], () => ChartService.getPayLimitChart(), {
    // enabled: !isLoading,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const Bullet = ({ backgroundColor, size }: { backgroundColor: any; size: any }) => {
    return (
      <div
        className='CirecleBullet'
        style={{
          backgroundColor,
          width: size,
          height: size,
        }}
      ></div>
    );
  };
  const CustomizedLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className='LegendList'>
        {payload.map((entry: any, index: any) => (
          <li key={`item-${index}`}>
            <div className='BulletLabel'>
              <Bullet backgroundColor={entry.payload.fill} size='10px' />
              <div className='BulletLabelText'>{entry.value}</div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const getData = () => {
    const chartData = data;

    return [
      {
        name: 'Hạn mức đã dùng (VNĐ)',
        value: chartData?.used,
      },
      {
        name: 'Hạn mức còn lại (VNĐ)',
        value: chartData?.total - chartData?.used,
      },
    ];
  };

  return (
    <div>
      <Card className='h-full' title='Tình hình hạn mức'>
        <ResponsiveContainer height={300}>
          <PieChart
            width={800}
            height={400}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <Pie data={getData()} innerRadius={60} outerRadius={80} fill='#8884d8' dataKey='value' label>
              {getData()?.map((entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend content={<CustomizedLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
