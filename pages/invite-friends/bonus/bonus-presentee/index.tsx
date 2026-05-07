import { PrimaryLayout } from '@components/widgets/Layouts';
import { BonusPresenteeList } from '@modules/invite-friends/bonus/bonus-presentee/BonussPresenteeList';
import { BonusTabs } from '@modules/invite-friends/bonus/BonusTab';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function BonusPresenteePage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTabs activeItem="bonus-presentee" />
      </div>
      <BonusPresenteeList />
    </PrimaryLayout>
  );
}
