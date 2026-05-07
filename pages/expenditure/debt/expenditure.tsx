import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { COMMON_FORMAT } from '@constants/common-format';
import { DateTimeHelper } from '@helpers/date-time.helper';
import AddNewDebtButton from '@modules/expenditure/debt/AddNewDebtButton';
import ExpenditureDebtList from '@modules/expenditure/debt/ExpenditureDebtList';
import { ExpenditureDebtListFilter } from '@modules/expenditure/debt/ExpenditureDebtListFilter';
import { ExportDebtListButton } from '@modules/expenditure/debt/ExportDebtListButton';
import { CompanyService } from '@services/companies';
import { DebtService } from '@services/debt-cash';

import { useState } from 'react';
import { useQuery } from 'react-query';
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ExpenditureDebtPage() {
  const [filter, setFilter] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { data, isLoading, refetch } = useQuery(
    ['expenditure-debt-list', filter],
    () => DebtService.getListDebts(filter),
    {
      enabled: filter != null,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );
  const {
    data: companyData,
    isLoading: isLoadingCompanyData,
    isFetching: isFetchingCompanyData,
    refetch: reFetchCompanyData,
  } = useQuery(
    ['company-data'],
    async () => {
      const response = await CompanyService.getAllCompaniesDropdown({});
      return response;
    },
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
    }
  );

  const onFilterSubmit = (values: any) => {
    const requestFilter = {
      ...values,
      companyIds: [values?.companyIds],
      periods: values?.periods.map((x: any) => {
        const arr = x.split('|');
        return {
          startDate: DateTimeHelper.formatDateTime(
            arr[0],
            COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
          ),
          endDate: DateTimeHelper.formatDateTime(
            arr[1],
            COMMON_FORMAT.LOCAL_DATE_YYYY_MM_DD
          ),
        };
      }),
    };
    setFilter(requestFilter);
  };
  const onPagination = (e: any) => {
    setFilter({
      ...filter,
      page: e,
    });
  };
  if (isLoadingCompanyData) return <></>;

  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <ExpenditureDebtListFilter
          onSubmit={onFilterSubmit}
          companyData={companyData}
          refetch={refetch}
          setFilter={setFilter}
          filter={filter}
        />
      </div>
      <ContentWrapper
        pageTitle="Quản lý công nợ"
        extra={
          <>
            <ExportDebtListButton
              filterExport={filter}
              companyData={companyData}
            />
            <AddNewDebtButton
              setIsOpenModal={setIsOpenModal}
              isOpenModal={isOpenModal}
              filter={filter}
              refetch={refetch}
            />
          </>
        }
      >
        <ExpenditureDebtList
          loading={isLoading}
          data={data}
          onPaginate={onPagination}
          setIsOpenModal={setIsOpenModal}
          isOpenModal={isOpenModal}
          filter={filter}
          refetch={refetch}
        />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
