import { ContentWrapper, MainContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { ConfigurationGeneralInfomation } from '@modules/configurations/ConfigurationGeneralInfomation';
import { useRouter } from 'next/router';
import { useState } from 'react';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {},
  };
}

export default function CompanyPage() {
  const [checkData, setCheckData] = useState(true);
  const router = useRouter();

  return (
    <PrimaryLayout>
      <ContentWrapper pageTitle="Quản lý cấu hình">
        <ConfigurationGeneralInfomation setCheckData={setCheckData} />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
