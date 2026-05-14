import { Container, ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { UserRole } from '@constants/auth.constants';
import { FeePolicyTemplateActionForm } from '@modules/fee-policies';

import { useRouter } from 'next/router';
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function FeePolicyTemplatePage() {
  const router = useRouter();

  return (
    <PrimaryLayout breadcrumbs={['Quản lý mẫu chính sách phí']}>
      <ContentWrapper
        pageTitle="Tạo mới biểu mẫu chính sách phí"
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.CUSTOMER_SERVICE,
        ]}
      >
        <FeePolicyTemplateActionForm
          isNew={true}
          onCancel={() => router.push(`/fee-policies/templates`)}
        />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
