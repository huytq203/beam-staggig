import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { ReconciliationBank } from '@modules/reconciliation';
import { ReconciliationTabs } from '@modules/reconciliation/ReconciliationTabs';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ReconciliationBankPage() {
  const bank = 'vietcombank';
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <ReconciliationTabs activeItem="home" bank={bank} />
      </div>
      <ContentWrapper>
        <ReconciliationBank bank={bank} />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
