import { ChartService } from '@services/chart';
import React from 'react';
import { useQuery } from 'react-query';

export const RegisterAppChart = () => {
  const { data, isLoading, refetch } = useQuery(['pay-register-app-chart'], () => ChartService.getRegisterAppChart(), {
    // enabled: !isLoading,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
  });

  return (
    <div className='h-full' title='Người dùng cài app'>
      <div className='flex h-full flex-col gap-4 items-center justify-center text-4xl font-bold'>
        <span>Số người tải app</span>
        <div>{data}</div>
      </div>
    </div>
  );
};
