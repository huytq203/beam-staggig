import { ReportService } from '@services/report';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ReportOperationsList } from './ReportOperationsList';
import { ReportOperationsFilter } from './ReportOperationsFilter';
import { ContentWrapper } from '@components/widgets';
import { useWidget } from '@contexts/widgets';
export const ReportOperations = () => {
  const [filter, setFilter] = useState<any>({
    companyIds: [],
    startTime: '',
    endTime: '',
    type: 'OVERVIEW',
    isMonth: 0,
    // page: 1,
    // size: 20,
  });
  const { checkLoadingComponent } = useWidget();
  const { data, isLoading, refetch, isFetching } = useQuery(
    ['report-operations', filter],
    () => ReportService.getAllOperationReport(filter),
    {
      enabled: filter != null,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  checkLoadingComponent(isLoading);
  const onFilter = (values: any) => {
    setFilter(values);
    refetch();
  };
  return (
    <div className="flex flex-col gap-4">
      <ContentWrapper pageTitle="Báo cáo vận hành">
        <ReportOperationsFilter onSubmit={onFilter} refetch={refetch} />
        <ReportOperationsList
          data={data}
          filter={filter}
          setFilter={setFilter}
        />
      </ContentWrapper>
    </div>
  );
};
