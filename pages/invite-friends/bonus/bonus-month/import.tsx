import { PrimaryLayout } from '@components/widgets/Layouts';
import { BonusTabs } from '@modules/invite-friends/bonus/BonusTab';
import ImportBonusMonthForm from '@modules/invite-friends/bonus/bonus-month/ImportBonusMonthForm';
import { useRouter } from 'next/router';
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ImportBonusMonthPage() {
  const router = useRouter();
  const originalBonusInvitedRoute = '/invite-friends/bonus/bonus-month';
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTabs activeItem="bonus-month" />
      </div>
      <ImportBonusMonthForm
        onCancel={() => router.push(originalBonusInvitedRoute)}
      />
    </PrimaryLayout>
  );
}
