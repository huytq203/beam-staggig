import { PrimaryLayout } from '@components/widgets/Layouts';
import { InvitaionTabs } from '@modules/invite-friends/invitaion-list/InvitaionTabs';
import { PresenteeList } from '@modules/invite-friends/invitaion-list/presentee/PresenteeList';

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function PresenteePage() {
  return (
    <PrimaryLayout>
      <div className="pt-6 px-6">
        <InvitaionTabs activeItem="presentee" />
      </div>
      <PresenteeList />
    </PrimaryLayout>
  );
}
