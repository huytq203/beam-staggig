import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { CreateCampaignForm } from '@modules/campaigns';

import { NextPage } from 'next';

import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {
      // companyData: companyData.data,
      // currentProfile: companyCurrentProfile,
    },
  };
}

const EditCampaginPage: NextPage = (props: any) => {
  const router = useRouter();

  const baseRoute = `/campaigns`;

  const campaignId = router.query.campaignId;

  return (
    <PrimaryLayout breadcrumbs={['Chi tiết chiến dịch']}>
      <CreateCampaignForm
        campaignId={campaignId}
        isNew={false}
        onClickCancel={() => router.push(baseRoute)}
      />
    </PrimaryLayout>
  );
};

export default EditCampaginPage;
