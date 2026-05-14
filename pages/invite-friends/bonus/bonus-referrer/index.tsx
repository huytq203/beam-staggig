import { PrimaryLayout } from '@components/widgets/Layouts';
import { BonusTabs } from '@modules/invite-friends/bonus/BonusTab';
import { BonusReferrerList } from '@modules/invite-friends/bonus/bonus-referrer/BonusReferrerList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function BonusReferrerPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTabs activeItem="bonus-referrer" />
      </div>
      <BonusReferrerList />
    </PrimaryLayout>
  );
}
