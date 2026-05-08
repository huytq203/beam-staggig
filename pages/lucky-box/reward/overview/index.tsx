import { PrimaryLayout } from '@components/widgets';
import { RewardTab } from '@modules/lucky-box/reward/RewardTab';
import { OverviewList } from '@modules/lucky-box/reward/overview/OverviewList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function RewardOverviewPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <RewardTab activeItem="overview" />
      </div>
      <OverviewList />
    </PrimaryLayout>
  );
}
