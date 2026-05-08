import { PrimaryLayout } from '@components/widgets/Layouts';
import { BonusTabs } from '@modules/invite-friends/bonus/BonusTab';
import { BonusMonthList } from '@modules/invite-friends/bonus/bonus-month/BonusMonthList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function BonusMonthPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTabs activeItem="bonus-month" />
      </div>
      <BonusMonthList />
    </PrimaryLayout>
  );
}
