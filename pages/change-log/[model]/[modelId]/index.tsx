import { ContentWrapper } from '@components/widgets';
import { PrimaryLayout } from '@components/widgets/Layouts';
import { CampaignList } from '@modules/campaigns';
import { ChangeLogList } from '@modules/changeLog';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  const { locale } = props;

  return {
    props: {},
  };
}

const ListChangeLogPage: NextPage = (props: any) => {
  const router = useRouter();

  return (
    <PrimaryLayout>
      <ContentWrapper
        pageTitle="Lịch sử cập nhật"
        secondaryButtonText="Quay lại"
        onClickSecondaryButton={() => router.back()}
      >
        <ChangeLogList />
      </ContentWrapper>
    </PrimaryLayout>
  );
};

export default ListChangeLogPage;
