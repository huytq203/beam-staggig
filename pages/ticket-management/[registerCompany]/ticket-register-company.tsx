import { ContentWrapper, MainContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { TicketNewCompany } from '@modules/ticket-management';
import { useRouter } from 'next/router';
import { useState } from 'react';
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function TicketRegisterCompanyPage() {
  const [checkData, setCheckData] = useState(true);
  const router = useRouter();
  return (
    <PrimaryLayout>
      <MainContentWrapper data={checkData}>
        <ContentWrapper
          pageTitle="Chi tiết doanh nghiệp đăng ký mới"
          onClickSecondaryButton={() => router.push('/ticket-management')}
          secondaryButtonText="Quay lại"
        >
          <TicketNewCompany setCheckData={setCheckData} />
        </ContentWrapper>
      </MainContentWrapper>
    </PrimaryLayout>
  );
}
