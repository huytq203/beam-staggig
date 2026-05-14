import { Container, ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { FeeCompanyForm, FeePolicyAssignForm } from '@modules/fee-policies';

import { useRouter } from 'next/router';
export async function getServerSideProps(props: any) {
  return {
    props: {
      
    },
  };
}

export default function FeePolicyTemplatePage() {
  const router = useRouter();

  return (
    <PrimaryLayout>
      <ContentWrapper pageTitle='Chọn doanh nghiệp để gán chính sách phí'>
        <FeePolicyAssignForm onCancel={() => router.push(`/fee-policies/assign`)} />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
