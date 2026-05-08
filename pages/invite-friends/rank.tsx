import { PrimaryLayout } from '@components/widgets/Layouts';
import { RankList } from '@modules/invite-friends/ranking/RankList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function RankPage() {
  return (
    <PrimaryLayout>
      <RankList />
    </PrimaryLayout>
  );
}
