import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { ReconciliationBank } from '@modules/reconciliation';
import { ReconciliationTabs } from '@modules/reconciliation/ReconciliationTabs';
import { useRouter } from 'next/router';
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ReconciliationBankPage() {
  const router = useRouter();
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <ReconciliationTabs activeItem="home" bank="pvcbank" />
      </div>
      <ContentWrapper>
        <ReconciliationBank bank="pvcbank" />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
