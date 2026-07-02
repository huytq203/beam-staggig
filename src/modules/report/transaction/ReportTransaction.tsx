import { AppPagination } from '@components/shared';
import { ReportService } from '@services/report';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ReportTransactionFilter } from './ReportTransactionFilter';
import { ReportTransactionList } from './ReportTransactionList';
import { DateTimeHelper } from '@helpers/date-time.helper';
import { useWidget } from '@contexts/widgets';
import { TIMEZONE_FORMAT } from '@constants/common-format';
export const ReportTransaction = (props: any) => {
  const { companyData } = props;
  const { checkLoadingComponent } = useWidget();
  const [filter, setFilter] = useState<any>({
    data: '',
    page: 1,
    size: 10,
    companyId: '',
    startTime: DateTimeHelper.setStartTime(
      DateTimeHelper.getCurrentDate(),
      TIMEZONE_FORMAT.GMT7
    )
      .tz(TIMEZONE_FORMAT.GMT0)
      .format(),
    endTime: DateTimeHelper.setEndTime(
      DateTimeHelper.getCurrentDate(),
      TIMEZONE_FORMAT.GMT7
    )
      .tz(TIMEZONE_FORMAT.GMT0)
      .format(),
    status: '',
  });
  const { data, isLoading, refetch } = useQuery(
    ['report-transaction', filter],
    () => ReportService.getAllReportTransaction(filter),
    {
      enabled: filter != null,
      refetchOnWindowFocus: true,
      refetchIntervalInBackground: true,
    }
  );
  checkLoadingComponent(isLoading);
  // useEffect(() => {
  //   if (filter != null) {
  //     refetch();
  //   }
  // }, [filter]);
  const onFilter = (values: any) => {
    setFilter(values);
    refetch();
  };
  return (
    <div className="flex flex-col gap-4">
      <ReportTransactionFilter
        onSubmit={onFilter}
        refetch={refetch}
        companyData={companyData}
        setFilter={setFilter}
      />
      <ReportTransactionList
        data={data}
        loading={isLoading}
        setFilter={setFilter}
        filter={filter}
      />
      <div className="py-2 w-full flex justify-end">
        <AppPagination
          {...data?.data?.transactions}
          onChange={(e: any) => {
            setFilter({
              ...filter,
              page: e,
            });
          }}
        />
      </div>
    </div>
  );
};
