import { PrimaryLayout } from '@components/widgets';
import { OverviewList } from '@modules/lucky-box/participate/overview/OverviewList';
import { ParticipateTab } from '@modules/lucky-box/participate/ParticipateTab';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ParticipateOverviewPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <ParticipateTab activeItem="overview" />
      </div>
      <OverviewList />
    </PrimaryLayout>
  );
}
