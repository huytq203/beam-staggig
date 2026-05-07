import { PrimaryLayout } from '@components/widgets/Layouts';
import { InvitaionTabs } from '@modules/invite-friends/invitaion-list/InvitaionTabs';
import { ReferrerList } from '@modules/invite-friends/invitaion-list/referrer/ReferrerList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function PresenterPage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <InvitaionTabs activeItem="referrer" />
      </div>
      <ReferrerList />
    </PrimaryLayout>
  );
}
