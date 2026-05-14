import { Container, ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { UserRole } from '@constants/auth.constants';
import { FeeCompanyForm } from '@modules/fee-policies';

import { useRouter } from 'next/router';
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function FeePolicyTemplatePage() {
  const router = useRouter();

  return (
    <PrimaryLayout breadcrumbs={['Chi tiết chính sách phí']}>
      <ContentWrapper
        pageTitle="Tạo mới chính sách phí"
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.CUSTOMER_SERVICE,
        ]}
      >
        <FeeCompanyForm
          onCancel={() => router.push(`/fee-policies/assign`)}
          onSave={(id: any) => router.push(`/fee-policies/assign/${id}/assign`)}
        />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
