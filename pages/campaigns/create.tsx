import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { CreateCampaignForm } from '@modules/campaigns';
import { useAuth } from '@contexts/authentication';
import { NextPage } from 'next';

import { useRouter } from 'next/router';
import { UserRole } from '@constants/auth.constants';

export async function getServerSideProps(props: any) {
  const { locale } = props;
  return {
    props: {},
  };
}

const EditCompanyPage: NextPage = (props: any) => {
  const router = useRouter();
  const { authCheckByRole } = useAuth();
  authCheckByRole([
    UserRole.BEAM_ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CUSTOMER_SERVICE,
  ]);
  const baseRoute = `/campaigns`;
  return (
    <PrimaryLayout breadcrumbs={['Tạo mới chiến dịch']}>
      <CreateCampaignForm
        isNew={true}
        onClickCancel={() => router.push(baseRoute)}
      />
    </PrimaryLayout>
  );
};

export default EditCompanyPage;
