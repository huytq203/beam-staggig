import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { CampaignList } from '@modules/campaigns';
import { TicketManagementList } from '@modules/ticket-management/TicketManagementList';

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
    router.push(`${baseRoute}/${rowData.id}/edit`);
  };

  return (
    <PrimaryLayout>
      {/* <ContentWrapper pageTitle="Quản lý yêu cầu"> */}
      <TicketManagementList />
      {/* </ContentWrapper> */}
    </PrimaryLayout>
  );
};

export default ListCampaignPage;
