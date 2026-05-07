import { PrimaryLayout } from '@components/widgets';
import { BonusTab } from '@modules/lucky-box/bonus/BonusTab';
import { OverviewList } from '@modules/lucky-box/bonus/overview/OverviewList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function BonusOverviewPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTab activeItem="overview" />
      </div>
      <OverviewList />
    </PrimaryLayout>
  );
}
