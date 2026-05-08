import { PrimaryLayout } from '@components/widgets/Layouts';
import ImportBonusInvitedForm from '@modules/invite-friends/bonus/bonus-presentee/ImportBonusInvitedForm';
import { BonusTabs } from '@modules/invite-friends/bonus/BonusTab';
import { useRouter } from 'next/router';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function ImportBonusPresenteePage() {
  const router = useRouter();
  const originalBonusInvitedRoute = '/invite-friends/bonus/bonus-presentee';
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <BonusTabs activeItem="bonus-presentee" />
      </div>
      <ImportBonusInvitedForm
        onCancel={() => router.push(originalBonusInvitedRoute)}
      />
    </PrimaryLayout>
  );
}
