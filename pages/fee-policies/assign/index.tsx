import { Container, ContentWrapper, PageBreadcrumb } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { UserRole } from '@constants/auth.constants';
import { FeePolicyList } from '@modules/fee-policies';

import { useRouter } from 'next/router';
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function FeePolicyPage() {
  const router = useRouter();
  return (
    <PrimaryLayout>
      <ContentWrapper
        pageTitle="Danh sách các chính sách phí đã được gán"
        primaryButtonText="Gán chính sách phí"
        onClickPrimaryButton={() => router.push('/fee-policies/assign/create')}
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.CUSTOMER_SERVICE,
        ]}
      >
        <FeePolicyList />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
