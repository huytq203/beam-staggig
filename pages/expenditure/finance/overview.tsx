import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { CashflowOverview } from '@modules/expenditure';
import { CashflowOverviewFilter } from '@modules/expenditure/finance/CashflowOverviewFilter';
import { CashflowTabs } from '@modules/expenditure/finance/CashflowTabs';

export async function getServerSideProps(props: any) {
  return {
    props: {
      
    },
  };
}

export default function ExpenditureFinanceOverviewPage() {
  return (
    <PrimaryLayout>
      <div className='pt-6 px-6 flex flex-col gap-4'>
        <CashflowTabs activeKey='overview' />
        <CashflowOverviewFilter />
      </div>
      <ContentWrapper pageTitle='Thống kê trạng thái theo doanh nghiệp'>
        <CashflowOverview />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
