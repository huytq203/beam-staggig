import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { UserRole } from '@constants/auth.constants';
import { CampaignList } from '@modules/campaigns';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {},
  };
}

const ListCampaignPage: NextPage = (props: any) => {
  const router = useRouter();

  const baseRoute = `/campaigns`;

  const onClickViewAccountDetail = (rowData: any) => {
    router.push(`${baseRoute}/${rowData.id}`);
  };

  return (
    <PrimaryLayout>
      <ContentWrapper
        pageTitle="Quản lý chiến dịch"
        primaryButtonText="Thêm Chiến dịch"
        onClickPrimaryButton={() => router.push('/campaigns/create')}
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.CUSTOMER_SERVICE,
        ]}
      >
        <CampaignList
          basePath={baseRoute}
          onClickViewDetail={onClickViewAccountDetail}
        />
      </ContentWrapper>
    </PrimaryLayout>
  );
};

export default ListCampaignPage;
