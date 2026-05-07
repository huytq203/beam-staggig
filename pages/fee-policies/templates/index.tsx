import { Container, ContentWrapper, PageBreadcrumb } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { UserRole } from '@constants/auth.constants';
import { FeePolicyTemplateList } from '@modules/fee-policies';

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
        pageTitle="Quản lý mẫu chính sách phí"
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.CUSTOMER_SERVICE,
        ]}
      >
        <FeePolicyTemplateList />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
