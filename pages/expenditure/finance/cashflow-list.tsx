import { BoxWrapper, ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { BaseFilter } from '@constants/models/BaseFilter';
import { AccountBalance, CashflowListFilter } from '@modules/expenditure';
import CashFlowList from '@modules/expenditure/finance/CashFlowList';
import { CashflowTabs } from '@modules/expenditure/finance/CashflowTabs';
import { DebtService } from '@services/debt-cash';

import { useState } from 'react';
import { useQuery } from 'react-query';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ExpenditureFinanceCashflowListPage() {
  const [filter, setFilter] = useState<any>(null);

  const { data, isLoading, isFetching, refetch } = useQuery(
    ['cash_flow_list_details', filter],
    () => DebtService.getCashflowDetails(filter),
    {
      enabled: filter != null,
      refetchOnWindowFocus: false,
    }
  );

  const onFilter = (values: any) => {
    const companyPeriods = values?.periods.map((x: any) => {
      const periodsString = x.split('|');
      return {
        companyId: periodsString[0],
        periods: [
          {
            startDate: periodsString[1],
            endDate: periodsString[2],
          },
        ],
      };
    });

    const request = {
      status: values?.status,
      payStatus: values?.payStatus,
      companyPeriods,
    };
    setFilter(request);
  };

  const onPagination = (e: any) => {
    setFilter({
      ...filter,
      page: e,
    });
  };

  return (
    <PrimaryLayout>
      <div className="pt-6 px-6 flex flex-col gap-4">
        <CashflowTabs activeKey="cashflow-list" />
        <div className="grid grid-cols-1 gap-4">
          <BoxWrapper padding={6}>
            <CashflowListFilter onSubmit={onFilter} />
          </BoxWrapper>
        </div>
      </div>

      <ContentWrapper pageTitle="Quản lý dòng tiền giao dịch">
        <CashFlowList
          data={data?.data}
          loading={isLoading}
          fetching={isFetching}
          onPaginate={onPagination}
        />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
