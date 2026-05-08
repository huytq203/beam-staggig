import { ContentWrapper } from '@components/widgets';
import { MainContentWrapper } from '@components/widgets/ContentWrapper/MainContentWrapper';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { UserRole } from '@constants/auth.constants';
import { FeePolicyTemplate } from '@modules/fee-policies';
import { useState } from 'react';
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function FeePolicyTemplatePage() {
  const [checkData, setCheckData] = useState(true);

  return (
    <PrimaryLayout>
      <MainContentWrapper data={checkData}>
        <ContentWrapper
          pageTitle="Quản lý mẫu chính sách phí"
          allowedRoles={[
            UserRole.BEAM_ADMIN,
            UserRole.SUPER_ADMIN,
            UserRole.CUSTOMER_SERVICE,
          ]}
        >
          <FeePolicyTemplate setCheckData={setCheckData} />
        </ContentWrapper>
      </MainContentWrapper>
    </PrimaryLayout>
  );
}
